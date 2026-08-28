import { useSyncExternalStore } from "react";
import { CartItem } from "./cart";
import {
  getOrdersServer,
  clearAllOrdersServer,
  addOrderServer,
  updateOrderStatusServer,
  deleteOrderServer
} from "./db";

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
  device?: string;
};

const emptyOrders: Order[] = [];

// ==========================================
// CUSTOMER ORDER STORE (LOCAL STORAGE + SYNC)
// ==========================================
class CustomerOrderStore {
  orders: Order[] = [];
  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      // Load from dedicated customer local storage key
      const savedOrders = localStorage.getItem("uk09_my_orders");
      if (savedOrders) {
        try {
          this.orders = JSON.parse(savedOrders);
        } catch {}
      } else {
        // Migration: fallback to old common storage key if exists
        const oldOrders = localStorage.getItem("uk09_orders");
        if (oldOrders) {
          try {
            this.orders = JSON.parse(oldOrders);
          } catch {}
          // Save it in the new key immediately
          localStorage.setItem("uk09_my_orders", oldOrders);
        }
      }

      // Fresh sync and regular polling
      this.syncFromServer();
      setInterval(() => {
        this.syncFromServer();
      }, 5000);
    }
  }

  async syncFromServer() {
    try {
      const syncState = await getOrdersServer();
      if (!syncState) return;

      const { orders: serverOrders } = syncState;

      let hasStateChanges = false;
      const updatedOrders = this.orders.map((o) => {
        if (!o) return o;
        const matchingServerOrder = (serverOrders || []).find((so) => so && so.id === o.id);
        if (matchingServerOrder && matchingServerOrder.status !== o.status) {
          hasStateChanges = true;
          return { ...o, status: matchingServerOrder.status };
        }
        return o;
      });

      if (hasStateChanges) {
        this.orders = updatedOrders;
        this.notify();
      }
    } catch (e) {
      console.error("Failed to sync customer orders from server:", e);
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("uk09_my_orders", JSON.stringify(this.orders));
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

  addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "createdAtTimestamp" | "device">): Order => {
    const now = Date.now();
    
    // Detect device details
    let device = "Unknown Device";
    if (typeof window !== "undefined" && window.navigator) {
      const ua = window.navigator.userAgent;
      const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua);
      const isTablet = /tablet|ipad|playbook|silk/i.test(ua);
      
      if (/iPhone/i.test(ua)) device = "iPhone (iOS)";
      else if (/iPad/i.test(ua)) device = "iPad (iOS)";
      else if (/Android/i.test(ua)) device = isTablet ? "Android Tablet" : "Android Mobile";
      else if (/Macintosh/i.test(ua)) device = "Mac (macOS)";
      else if (/Windows/i.test(ua)) device = "Windows PC";
      else if (/Linux/i.test(ua)) device = "Linux PC";
      else if (isMobile) device = "Mobile Device";
      else if (isTablet) device = "Tablet Device";
      else device = "Desktop PC";
    }

    const newOrder: Order = {
      ...orderData,
      id: `UK09-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Received",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAtTimestamp: now,
      device,
    };

    this.orders = [newOrder, ...this.orders];
    this.notify();

    // Call granular server function instead of rewriting the whole server list
    addOrderServer({ data: { order: newOrder } }).catch((e) =>
      console.error("Server save failed on addOrder:", e)
    );

    return newOrder;
  };

  cancelOrder = (id: string) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.notify();

    updateOrderStatusServer({ data: { id, status: "Cancelled" } }).catch((e) =>
      console.error("Server cancel order failed:", e)
    );
  };

  updateOrderStatus = (id: string, status: OrderStatus) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.notify();

    updateOrderStatusServer({ data: { id, status } }).catch((e) =>
      console.error("Server update order status failed:", e)
    );
  };

  deleteOrder = (id: string) => {
    // Delete only for the customer locally
    this.orders = this.orders.filter((o) => o.id !== id);
    this.notify();
  };

  clearAllOrders = () => {
    // Clear only for the customer locally
    this.orders = [];
    this.notify();
  };
}

export const orderStore = new CustomerOrderStore();

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

// ==========================================
// ADMIN ORDER STORE (READS FULL SERVER STATE)
// ==========================================
class AdminOrderStore {
  orders: Order[] = [];
  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.syncFromServer();
      setInterval(() => {
        this.syncFromServer();
      }, 5000);
    }
  }

  async syncFromServer() {
    try {
      const syncState = await getOrdersServer();
      if (!syncState) return;

      const { orders: serverOrders, deletedOrderIds, lastClearedAt } = syncState;

      // Filter server orders based on admin deleted list and last cleared timestamp
      const filteredOrders = (serverOrders || []).filter((o) => {
        if (!o) return false;
        if (deletedOrderIds && deletedOrderIds.includes(o.id)) return false;
        if (lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= lastClearedAt) {
          return false;
        }
        return true;
      });

      const prevStr = JSON.stringify(this.orders);
      const newStr = JSON.stringify(filteredOrders);

      if (prevStr !== newStr) {
        this.orders = filteredOrders;
        this.notify();
      }
    } catch (e) {
      console.error("Failed to sync admin orders from server:", e);
    }
  }

  notify() {
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

  updateOrderStatus = (id: string, status: OrderStatus) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this.notify();

    updateOrderStatusServer({ data: { id, status } }).catch((e) =>
      console.error("Admin status update failed:", e)
    );
  };

  cancelOrder = (id: string) => {
    this.orders = this.orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o
    );
    this.notify();

    updateOrderStatusServer({ data: { id, status: "Cancelled" } }).catch((e) =>
      console.error("Admin cancel order failed:", e)
    );
  };

  deleteOrder = (id: string) => {
    // Delete permanently from the server (meaning for the admin's list)
    this.orders = this.orders.filter((o) => o.id !== id);
    this.notify();

    deleteOrderServer({ data: { id } }).catch((e) =>
      console.error("Admin order deletion failed:", e)
    );
  };

  clearAllOrders = () => {
    // Clear permanently from the server (meaning for the admin's view)
    this.orders = [];
    this.notify();

    clearAllOrdersServer().catch((e) =>
      console.error("Admin clear all orders failed:", e)
    );
  };
}

export const adminOrderStore = new AdminOrderStore();

export function useAdminOrders() {
  const orders = useSyncExternalStore(
    adminOrderStore.subscribe,
    adminOrderStore.getSnapshot,
    adminOrderStore.getServerSnapshot
  );

  return {
    orders,
    updateOrderStatus: adminOrderStore.updateOrderStatus,
    cancelOrder: adminOrderStore.cancelOrder,
    deleteOrder: adminOrderStore.deleteOrder,
    clearAllOrders: adminOrderStore.clearAllOrders,
  };
}
