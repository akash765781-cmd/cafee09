import { useSyncExternalStore } from "react";
import { CartItem } from "./cart";
import { getOrdersServer, setOrdersServer } from "./db";

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
};

const emptyOrders: Order[] = [];

class OrderStore {
  orders: Order[] = [];
  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      // 1. Initial local load for instant UI feedback
      const saved = localStorage.getItem("uk09_orders");
      if (saved) {
        try {
          this.orders = JSON.parse(saved);
        } catch {
          // ignore
        }
      }

      // 2. Fetch fresh data from server
      this.syncFromServer();

      // 3. Keep syncing from server every 5 seconds (enables cross-device updates)
      setInterval(() => {
        this.syncFromServer();
      }, 5000);
    }
  }

  async syncFromServer() {
    try {
      const serverOrders = await getOrdersServer();

      // Case 1: Server has no orders (e.g. serverless cold start), but client has local orders.
      // Do NOT wipe local orders! Repopulate the server with client's saved orders.
      if ((!serverOrders || serverOrders.length === 0) && this.orders.length > 0) {
        setOrdersServer({ data: this.orders }).catch(() => {});
        return;
      }

      if (!serverOrders) return;

      // Case 2: Intelligent Merge (Order ID based)
      let changed = false;
      const orderMap = new Map<string, Order>();

      // Load existing local orders first
      for (const localOrder of this.orders) {
        orderMap.set(localOrder.id, localOrder);
      }

      // Merge server orders
      for (const sOrder of serverOrders) {
        const localOrder = orderMap.get(sOrder.id);
        if (!localOrder) {
          // New order from another device
          orderMap.set(sOrder.id, sOrder);
          changed = true;
        } else {
          // Existing order: update status if changed by Admin or server
          if (localOrder.status !== sOrder.status) {
            orderMap.set(sOrder.id, { ...localOrder, status: sOrder.status });
            changed = true;
          }
        }
      }

      if (changed || orderMap.size !== this.orders.length) {
        // Convert map back to array sorted by creation date / ID
        const merged = Array.from(orderMap.values());
        this.orders = merged;
        this.notify();
        // Keep server updated with full merged list
        setOrdersServer({ data: merged }).catch(() => {});
      }
    } catch (e) {
      console.error("Failed to sync orders from server:", e);
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("uk09_orders", JSON.stringify(this.orders));
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

  addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `UK09-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Received",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    this.orders = [newOrder, ...this.orders];
    this.notify();
    
    // Push to server asynchronously
    setOrdersServer({ data: this.orders }).catch((e) =>
      console.error("Server save failed on addOrder:", e)
    );

    return newOrder;
  };

  cancelOrder = (id: string) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.notify();

    // Push to server asynchronously
    setOrdersServer({ data: this.orders }).catch((e) =>
      console.error("Server save failed on cancelOrder:", e)
    );
  };

  updateOrderStatus = (id: string, status: OrderStatus) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.notify();

    // Push to server asynchronously
    setOrdersServer({ data: this.orders }).catch((e) =>
      console.error("Server save failed on updateOrderStatus:", e)
    );
  };

  deleteOrder = (id: string) => {
    this.orders = this.orders.filter((o) => o.id !== id);
    this.notify();

    // Push to server asynchronously
    setOrdersServer({ data: this.orders }).catch((e) =>
      console.error("Server save failed on deleteOrder:", e)
    );
  };

  clearAllOrders = () => {
    this.orders = [];
    this.notify();

    // Push to server asynchronously
    setOrdersServer({ data: this.orders }).catch((e) =>
      console.error("Server save failed on clearAllOrders:", e)
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
