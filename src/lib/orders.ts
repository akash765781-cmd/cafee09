import { useSyncExternalStore } from "react";
import { CartItem } from "./cart";
import { getOrdersServer, setOrdersServer, clearAllOrdersServer } from "./db";

export type OrderStatus = "Received" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  createdAtTimestamp?: number;
};

const emptyOrders: Order[] = [];

class OrderStore {
  orders: Order[] = [];
  deletedOrderIds: string[] = [];
  lastClearedAt: number = 0;
  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      // 1. Initial local load
      const savedOrders = localStorage.getItem("uk09_orders");
      if (savedOrders) {
        try { this.orders = JSON.parse(savedOrders); } catch {}
      }

      const savedDeleted = localStorage.getItem("uk09_deleted_order_ids");
      if (savedDeleted) {
        try { this.deletedOrderIds = JSON.parse(savedDeleted); } catch {}
      }

      const savedCleared = localStorage.getItem("uk09_last_cleared_at");
      if (savedCleared) {
        this.lastClearedAt = Number(savedCleared) || 0;
      }

      // Filter out deleted/cleared on startup
      this.filterInvalidOrders();

      // 2. Fetch fresh data from server
      this.syncFromServer();

      // 3. Sync from server every 5 seconds
      setInterval(() => {
        this.syncFromServer();
      }, 5000);
    }
  }

  filterInvalidOrders() {
    this.orders = this.orders.filter((o) => {
      if (this.deletedOrderIds.includes(o.id)) return false;
      if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) {
        return false;
      }
      return true;
    });
  }

  async syncFromServer() {
    try {
      const syncState = await getOrdersServer();
      if (!syncState) return;

      const { orders: serverOrders, deletedOrderIds: serverDeletedIds, lastClearedAt: serverLastCleared } = syncState;

      let hasStateChanges = false;

      // Update lastClearedAt
      if (serverLastCleared && serverLastCleared > this.lastClearedAt) {
        this.lastClearedAt = serverLastCleared;
        hasStateChanges = true;
      }

      // Merge deleted IDs
      if (serverDeletedIds && serverDeletedIds.length > 0) {
        const prevSet = new Set(this.deletedOrderIds);
        for (const id of serverDeletedIds) {
          if (!prevSet.has(id)) {
            this.deletedOrderIds.push(id);
            hasStateChanges = true;
          }
        }
      }

      // Filter local orders
      const activeLocal = this.orders.filter((o) => {
        if (this.deletedOrderIds.includes(o.id)) return false;
        if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) return false;
        return true;
      });

      // Filter server orders
      const activeServer = (serverOrders || []).filter((o) => {
        if (this.deletedOrderIds.includes(o.id)) return false;
        if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) return false;
        return true;
      });

      // Merge active orders
      const orderMap = new Map<string, Order>();
      for (const lo of activeLocal) {
        orderMap.set(lo.id, lo);
      }

      for (const so of activeServer) {
        const existing = orderMap.get(so.id);
        if (!existing) {
          orderMap.set(so.id, so);
          hasStateChanges = true;
        } else if (existing.status !== so.status) {
          orderMap.set(so.id, { ...existing, status: so.status });
          hasStateChanges = true;
        }
      }

      const merged = Array.from(orderMap.values());
      const prevStr = JSON.stringify(this.orders);
      const mergedStr = JSON.stringify(merged);

      if (prevStr !== mergedStr || hasStateChanges) {
        this.orders = merged;
        this.notify();
      }
    } catch (e) {
      console.error("Failed to sync orders from server:", e);
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("uk09_orders", JSON.stringify(this.orders));
      localStorage.setItem("uk09_deleted_order_ids", JSON.stringify(this.deletedOrderIds));
      localStorage.setItem("uk09_last_cleared_at", String(this.lastClearedAt));
    }
  }

  notify() {
    this.save();
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getSnapshot = () => this.orders;
  getServerSnapshot = () => emptyOrders;

  addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "createdAtTimestamp">): Order => {
    const now = Date.now();
    const newOrder: Order = {
      ...orderData,
      id: `UK09-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Received",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAtTimestamp: now,
    };

    this.orders = [newOrder, ...this.orders];
    this.notify();

    setOrdersServer({
      data: {
        orders: this.orders,
        deletedOrderIds: this.deletedOrderIds,
        lastClearedAt: this.lastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on addOrder:", e));

    return newOrder;
  };

  cancelOrder = (id: string) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.notify();

    setOrdersServer({
      data: {
        orders: this.orders,
        deletedOrderIds: this.deletedOrderIds,
        lastClearedAt: this.lastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on cancelOrder:", e));
  };

  updateOrderStatus = (id: string, status: OrderStatus) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.notify();

    setOrdersServer({
      data: {
        orders: this.orders,
        deletedOrderIds: this.deletedOrderIds,
        lastClearedAt: this.lastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on updateOrderStatus:", e));
  };

  deleteOrder = (id: string) => {
    this.orders = this.orders.filter((o) => o.id !== id);
    if (!this.deletedOrderIds.includes(id)) {
      this.deletedOrderIds.push(id);
    }
    this.notify();

    setOrdersServer({
      data: {
        orders: this.orders,
        deletedOrderIds: this.deletedOrderIds,
        lastClearedAt: this.lastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on deleteOrder:", e));
  };

  clearAllOrders = () => {
    const now = Date.now();
    this.orders = [];
    this.deletedOrderIds = [];
    this.lastClearedAt = now;
    this.notify();

    clearAllOrdersServer().catch((e) =>
      console.error("Server clearAllOrders failed:", e)
    );
  };
}

export const orderStore = new OrderStore();

export function useOrders() {
  const orders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getServerSnapshot
  );

  return {
    orders,
    addOrder: orderStore.addOrder,
    cancelOrder: orderStore.cancelOrder,
    updateOrderStatus: orderStore.updateOrderStatus,
    deleteOrder: orderStore.deleteOrder,
    clearAllOrders: orderStore.clearAllOrders,
  };
}
