import { createServerFn } from "@tanstack/react-start";
import { Order } from "./orders";

// Types for reviews
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SyncState {
  orders: Order[];
  deletedOrderIds: string[];
  lastClearedAt: number;
}

// In-memory fallback
let inMemoryDb = {
  orders: [] as Order[],
  reviews: [] as Review[],
  storeClosed: false,
  deletedOrderIds: [] as string[],
  lastClearedAt: 0
};

// REST KV Helpers for Vercel KV
function getEnv(key: string): string {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || "";
  }
  return "";
}

async function kvGet<T>(key: string, defaultValue: T): Promise<T> {
  const KV_URL = getEnv("KV_REST_API_URL");
  const KV_TOKEN = getEnv("KV_REST_API_TOKEN");

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result !== undefined && data.result !== null) {
          let val = data.result;
          if (typeof val === "string") {
            try {
              val = JSON.parse(val);
            } catch {}
          }
          return val as T;
        }
      }
    } catch (e) {
      console.error(`KV GET error for key ${key}:`, e);
    }
  }
  
  // Fallback to in-memory
  if (key === "uk09_orders") return inMemoryDb.orders as any;
  if (key === "uk09_reviews") return inMemoryDb.reviews as any;
  if (key === "uk09_store_closed") return inMemoryDb.storeClosed as any;
  if (key === "uk09_deleted_order_ids") return inMemoryDb.deletedOrderIds as any;
  if (key === "uk09_last_cleared_at") return inMemoryDb.lastClearedAt as any;
  return defaultValue;
}

async function kvSet(key: string, value: any) {
  // Update local memory
  if (key === "uk09_orders") inMemoryDb.orders = value;
  if (key === "uk09_reviews") inMemoryDb.reviews = value;
  if (key === "uk09_store_closed") inMemoryDb.storeClosed = value;
  if (key === "uk09_deleted_order_ids") inMemoryDb.deletedOrderIds = value;
  if (key === "uk09_last_cleared_at") inMemoryDb.lastClearedAt = value;

  const KV_URL = getEnv("KV_REST_API_URL");
  const KV_TOKEN = getEnv("KV_REST_API_TOKEN");

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(JSON.stringify(value))
      });
      if (!res.ok) {
        console.error(`KV SET status not ok for key ${key}: ${res.status}`);
      }
    } catch (e) {
      console.error(`KV SET error for key ${key}:`, e);
    }
  }
}

// Server Functions
export const getOrdersServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<SyncState> => {
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const deletedOrderIds = await kvGet<string[]>("uk09_deleted_order_ids", []);
    const lastClearedAt = await kvGet<number>("uk09_last_cleared_at", 0);
    return { orders, deletedOrderIds, lastClearedAt };
  });

export const setOrdersServer = createServerFn({ method: "POST" })
  .validator((data: { orders: Order[]; deletedOrderIds?: string[]; lastClearedAt?: number }) => data)
  .handler(async ({ data }) => {
    await kvSet("uk09_orders", data.orders);
    if (data.deletedOrderIds) {
      await kvSet("uk09_deleted_order_ids", data.deletedOrderIds);
    }
    if (typeof data.lastClearedAt === "number") {
      await kvSet("uk09_last_cleared_at", data.lastClearedAt);
    }
    return { success: true };
  });

export const addOrderServer = createServerFn({ method: "POST" })
  .validator((data: { order: Order }) => data)
  .handler(async ({ data }) => {
    const storeClosed = await getStoreClosedServer();
    if (storeClosed) {
      throw new Error("Store is currently closed for online orders.");
    }
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const updated = [data.order, ...orders];
    await kvSet("uk09_orders", updated);
    return { success: true };
  });

export const updateOrderStatusServer = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const updated = orders.map((o) => (o && o.id === data.id ? { ...o, status: data.status as any } : o));
    await kvSet("uk09_orders", updated);
    return { success: true };
  });

export const deleteOrderServer = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const updated = orders.filter((o) => o && o.id !== data.id);
    await kvSet("uk09_orders", updated);

    const deletedOrderIds = await kvGet<string[]>("uk09_deleted_order_ids", []);
    if (!deletedOrderIds.includes(data.id)) {
      deletedOrderIds.push(data.id);
      await kvSet("uk09_deleted_order_ids", deletedOrderIds);
    }
    return { success: true };
  });

export const clearAllOrdersServer = createServerFn({ method: "POST" })
  .handler(async () => {
    const now = Date.now();
    await kvSet("uk09_orders", []);
    await kvSet("uk09_deleted_order_ids", []);
    await kvSet("uk09_last_cleared_at", now);
    return { success: true, lastClearedAt: now };
  });

export const getReviewsServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<Review[]> => {
    return await kvGet<Review[]>("uk09_reviews", []);
  });

export const setReviewsServer = createServerFn({ method: "POST" })
  .validator((data: Review[]) => data)
  .handler(async ({ data: reviews }) => {
    await kvSet("uk09_reviews", reviews);
    return { success: true };
  });

export const getStoreClosedServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<boolean> => {
    const raw = await kvGet<any>("uk09_store_closed", false);
    if (typeof raw === "boolean") return raw;
    if (typeof raw === "string") return raw === "true";
    if (typeof raw === "object" && raw !== null) {
      if (typeof raw.data === "boolean") return raw.data;
      if (typeof raw.closed === "boolean") return raw.closed;
      if (typeof raw.data === "string") return raw.data === "true";
    }
    return false;
  });

export const setStoreClosedServer = createServerFn({ method: "POST" })
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    let isClosed = false;
    if (typeof data === "boolean") {
      isClosed = data;
    } else if (typeof data === "string") {
      isClosed = data === "true";
    } else if (typeof data === "object" && data !== null) {
      if (typeof data.data === "boolean") isClosed = data.data;
      else if (typeof data.closed === "boolean") isClosed = data.closed;
      else if (typeof data.data === "string") isClosed = data.data === "true";
    }
    await kvSet("uk09_store_closed", isClosed);
    return { success: true, storeClosed: isClosed };
  });
