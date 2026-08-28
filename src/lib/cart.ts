import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string; // unique string e.g. "Mix Veg-Half" or "Poha"
  name: string;
  price: number;
  quantity: number;
  portion?: "Half" | "Full";
};

const emptyArray: CartItem[] = [];

class CartStore {
  items: CartItem[] = [];
  listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const saved = localStorage.getItem("uk09_cart");
        if (saved) {
          try {
            this.items = JSON.parse(saved);
            this.notify();
          } catch {
            // ignore parsing errors
          }
        }
      }, 0);
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("uk09_cart", JSON.stringify(this.items));
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

  getSnapshot = () => this.items;
  getServerSnapshot = () => emptyArray;

  addItem = (item: Omit<CartItem, "quantity">) => {
    const existing = this.items.find((i) => i.id === item.id);
    if (existing) {
      this.items = this.items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      this.items = [...this.items, { ...item, quantity: 1 }];
    }
    this.notify();
  };

  removeItem = (id: string) => {
    this.items = this.items.filter((i) => i.id !== id);
    this.notify();
  };

  updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    this.items = this.items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    this.notify();
  };

  clearCart = () => {
    this.items = [];
    this.notify();
  };
}

export const cartStore = new CartStore();

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
  };
}
