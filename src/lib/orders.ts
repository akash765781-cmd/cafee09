import { useSyncExternalStore } from "react";
import { CartItem } from "./cart";
import { getOrdersServer, setOrdersServer, clearAdminOrdersServer } from "./db";

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
  // All server orders
  serverOrders: Order[] = [];
  adminDeletedOrderIds: string[] = [];
  adminLastClearedAt: number = 0;

  // Customer local orders
  customerOrders: Order[] = [];
  customerDeletedOrderIds: string[] = [];
  customerLastClearedAt: number = 0;

  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      // 1. Load customer local history
      const savedCustomerOrders = localStorage.getItem("uk09_my_orders") || localStorage.getItem("uk09_orders");
      if (savedCustomerOrders) {
        try { this.customerOrders = JSON.parse(savedCustomerOrders); } catch {}
      }

      const savedCustDeleted = localStorage.getItem("uk09_customer_deleted_order_ids");
      if (savedCustDeleted) {
        try { this.customerDeletedOrderIds = JSON.parse(savedCustDeleted); } catch {}
      }

      const savedCustCleared = localStorage.getItem("uk09_customer_last_cleared");
      if (savedCustCleared) {
        this.customerLastClearedAt = Number(savedCustCleared) || 0;
      }

      // Load admin local caches
      const savedAdminDeleted = localStorage.getItem("uk09_admin_deleted_order_ids");
      if (savedAdminDeleted) {
        try { this.adminDeletedOrderIds = JSON.parse(savedAdminDeleted); } catch {}
      }

      const savedAdminCleared = localStorage.getItem("uk09_admin_last_cleared");
      if (savedAdminCleared) {
        this.adminLastClearedAt = Number(savedAdminCleared) || 0;
      }

      // Initial filter
      this.filterCustomerOrders();

      // Fetch fresh data from server immediately & repeatedly
      this.syncFromServer();
      setInterval(() => {
        this.syncFromServer();
      }, 4000);
    }
  }

  filterCustomerOrders() {
    this.customerOrders = this.customerOrders.filter((o) => {
      if (this.customerDeletedOrderIds.includes(o.id)) return false;
      if (
        this.customerLastClearedAt &&
        o.createdAtTimestamp &&
        o.createdAtTimestamp <= this.customerLastClearedAt
      ) {
        return false;
      }
      return true;
    });
  }

  async syncFromServer() {
    try {
      const syncState = await getOrdersServer();
      if (!syncState) return;

      const {
        orders: remoteOrders = [],
        adminDeletedOrderIds: remoteAdminDeleted = [],
        adminLastClearedAt: remoteAdminCleared = 0,
      } = syncState;

      let hasChanges = false;

      // Update admin state
      if (remoteAdminCleared > this.adminLastClearedAt) {
        this.adminLastClearedAt = remoteAdminCleared;
        hasChanges = true;
      }

      if (remoteAdminDeleted.length > 0) {
        const set = new Set(this.adminDeletedOrderIds);
        for (const id of remoteAdminDeleted) {
          if (!set.has(id)) {
            this.adminDeletedOrderIds.push(id);
            hasChanges = true;
          }
        }
      }

      this.serverOrders = remoteOrders;

      // Update customer local orders status from remote server orders
      const remoteOrderMap = new Map<string, Order>();
      for (const rOrder of remoteOrders) {
        remoteOrderMap.set(rOrder.id, rOrder);
      }

      let customerOrdersUpdated = false;
      const updatedCustomerOrders = this.customerOrders.map((custOrder) => {
        const matchingRemote = remoteOrderMap.get(custOrder.id);
        if (matchingRemote && matchingRemote.status !== custOrder.status) {
          customerOrdersUpdated = true;
          return { ...custOrder, status: matchingRemote.status };
        }
        return custOrder;
      });

      if (customerOrdersUpdated) {
        this.customerOrders = updatedCustomerOrders;
        hasChanges = true;
      }

      if (hasChanges) {
        this.notify();
      }
    } catch (e) {
      console.error("Failed to sync orders from server:", e);
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("uk09_my_orders", JSON.stringify(this.customerOrders));
      localStorage.setItem("uk09_customer_deleted_order_ids", JSON.stringify(this.customerDeletedOrderIds));
      localStorage.setItem("uk09_customer_last_cleared", String(this.customerLastClearedAt));

      localStorage.setItem("uk09_admin_deleted_order_ids", JSON.stringify(this.adminDeletedOrderIds));
      localStorage.setItem("uk09_admin_last_cleared", String(this.adminLastClearedAt));
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

  getCustomerSnapshot = () => this.customerOrders;
  getAdminSnapshot = () => {
    return this.serverOrders.filter((o) => {
      if (this.adminDeletedOrderIds.includes(o.id)) return false;
      if (
        this.adminLastClearedAt &&
        o.createdAtTimestamp &&
        o.createdAtTimestamp <= this.adminLastClearedAt
      ) {
        return false;
      }
      return true;
    });
  };
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

    // Add to customer local orders
    this.customerOrders = [newOrder, ...this.customerOrders];
    // Add to server orders
    this.serverOrders = [newOrder, ...this.serverOrders];
    this.notify();

    // Persist to server for Admin view
    setOrdersServer({
      data: {
        orders: this.serverOrders,
        adminDeletedOrderIds: this.adminDeletedOrderIds,
        adminLastClearedAt: this.adminLastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on addOrder:", e));

    return newOrder;
  };

  cancelOrder = (id: string) => {
    this.customerOrders = this.customerOrders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.serverOrders = this.serverOrders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.notify();

    setOrdersServer({
      data: {
        orders: this.serverOrders,
        adminDeletedOrderIds: this.adminDeletedOrderIds,
        adminLastClearedAt: this.adminLastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on cancelOrder:", e));
  };

  updateOrderStatus = (id: string, status: OrderStatus) => {
    this.customerOrders = this.customerOrders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.serverOrders = this.serverOrders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.notify();

    setOrdersServer({
      data: {
        orders: this.serverOrders,
        adminDeletedOrderIds: this.adminDeletedOrderIds,
        adminLastClearedAt: this.adminLastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on updateOrderStatus:", e));
  };

  // Customer Clear Actions (ONLY affects Customer Local View)
  deleteCustomerOrder = (id: string) => {
    this.customerOrders = this.customerOrders.filter((o) => o.id !== id);
    if (!this.customerDeletedOrderIds.includes(id)) {
      this.customerDeletedOrderIds.push(id);
    }
    this.notify();
  };

  clearCustomerOrders = () => {
    const now = Date.now();
    this.customerOrders = [];
    this.customerDeletedOrderIds = [];
    this.customerLastClearedAt = now;
    this.notify();
  };

  // Admin Clear Actions (ONLY affects Admin View)
  deleteAdminOrder = (id: string) => {
    if (!this.adminDeletedOrderIds.includes(id)) {
      this.adminDeletedOrderIds.push(id);
    }
    this.notify();

    setOrdersServer({
      data: {
        orders: this.serverOrders,
        adminDeletedOrderIds: this.adminDeletedOrderIds,
        adminLastClearedAt: this.adminLastClearedAt,
      },
    }).catch((e) => console.error("Server save failed on deleteAdminOrder:", e));
  };

  clearAdminOrders = () => {
    const now = Date.now();
    this.adminLastClearedAt = now;
    this.adminDeletedOrderIds = [];
    this.notify();

    clearAdminOrdersServer().catch((e) =>
      console.error("Server clearAdminOrders failed:", e)
    );
  };
}

export const orderStore = new OrderStore();

export function useOrders() {
  const customerOrders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getCustomerSnapshot,
    orderStore.getServerSnapshot
  );

  const adminOrders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getAdminSnapshot,
    orderStore.getServerSnapshot
  );

  return {
    orders: customerOrders, // Default for customer components
    customerOrders,
    adminOrders,
    addOrder: orderStore.addOrder,
    cancelOrder: orderStore.cancelOrder,
    updateOrderStatus: orderStore.updateOrderStatus,
    deleteOrder: orderStore.deleteCustomerOrder, // Legacy alias for customer delete
    deleteCustomerOrder: orderStore.deleteCustomerOrder,
    clearCustomerOrders: orderStore.clearCustomerOrders,
    clearAllOrders: orderStore.clearCustomerOrders, // Legacy alias for customer clear
    deleteAdminOrder: orderStore.deleteAdminOrder,
    clearAdminOrders: orderStore.clearAdminOrders,
  };
}
