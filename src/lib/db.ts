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
  storeClosed?: boolean;
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


// Base64URL Helpers to bypass keyvalue.immanuel.co character constraints
function toBase64URL(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64URL(b64url: string): string {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) {
    b64 += "=";
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(atob(b64)));
}

async function immanuelGet(key: string): Promise<string | null> {
  try {
    const res = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/1xv3tt2d/${key}`);
    if (res.ok) {
      const text = await res.text();
      if (text) {
        return text.replace(/^"|"$/g, "").trim();
      }
    }
  } catch (e) {
    console.error(`Immanuel GET error for key ${key}:`, e);
  }
  return null;
}

async function immanuelSet(key: string, value: string): Promise<boolean> {
  try {
    const encodedValue = encodeURIComponent(value);
    const res = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/1xv3tt2d/${key}/${encodedValue}`, {
      method: "POST"
    });
    return res.ok;
  } catch (e) {
    console.error(`Immanuel SET error for key ${key}:`, e);
  }
  return false;
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
  
  // Persistent fallback to keyvalue.immanuel.co when Vercel KV is not connected
  try {
    if (key === "uk09_store_closed") {
      const val = await immanuelGet("uk09_store_closed");
      if (val !== null) {
        inMemoryDb.storeClosed = val === "true";
      }
      return inMemoryDb.storeClosed as any;
    }
    
    if (key === "uk09_last_cleared_at") {
      const val = await immanuelGet("uk09_last_cleared_at");
      if (val !== null) {
        inMemoryDb.lastClearedAt = Number(val) || 0;
      }
      return inMemoryDb.lastClearedAt as any;
    }

    if (key === "uk09_deleted_order_ids") {
      const val = await immanuelGet("uk09_deleted_order_ids");
      if (val !== null) {
        inMemoryDb.deletedOrderIds = val ? val.split(",") : [];
      }
      return inMemoryDb.deletedOrderIds as any;
    }

    if (key === "uk09_reviews") {
      const val = await immanuelGet("uk09_reviews_b64");
      if (val) {
        try {
          inMemoryDb.reviews = JSON.parse(fromBase64URL(val));
        } catch (e) {
          console.error("Failed to parse fallback reviews:", e);
        }
      }
      return inMemoryDb.reviews as any;
    }

    if (key === "uk09_orders") {
      const idsStr = await immanuelGet("uk09_order_ids");
      if (!idsStr) {
        return [] as any;
      }
      const ids = idsStr.split(",").filter(Boolean);
      const orderPromises = ids.map(async (id) => {
        const b64 = await immanuelGet(`uk09_order_${id}`);
        if (!b64) return null;
        try {
          const decoded = fromBase64URL(b64);
          return JSON.parse(decoded) as Order;
        } catch (e) {
          console.error(`Failed to parse fallback order ${id}:`, e);
          return null;
        }
      });
      const orders = (await Promise.all(orderPromises)).filter((o) => o !== null);
      inMemoryDb.orders = orders;
      return orders as any;
    }
  } catch (e) {
    console.error(`KVGET Fallback error for ${key}:`, e);
  }

  // Final fallback to in-memory
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
  } else {
    // Persistent fallback to keyvalue.immanuel.co when Vercel KV is not connected
    try {
      if (key === "uk09_store_closed") {
        await immanuelSet("uk09_store_closed", String(value));
      } else if (key === "uk09_last_cleared_at") {
        await immanuelSet("uk09_last_cleared_at", String(value));
      } else if (key === "uk09_deleted_order_ids") {
        const idsStr = Array.isArray(value) ? value.join(",") : "";
        await immanuelSet("uk09_deleted_order_ids", idsStr);
      } else if (key === "uk09_reviews") {
        const json = JSON.stringify(value);
        const b64 = toBase64URL(json);
        await immanuelSet("uk09_reviews_b64", b64);
      } else if (key === "uk09_orders") {
        const activeOrders = ((value || []) as Order[]).slice(0, 100);
        const idsStr = activeOrders.map((o) => o.id).join(",");
        await immanuelSet("uk09_order_ids", idsStr);
        
        // Save each active order individually in parallel
        await Promise.all(
          activeOrders.map(async (order) => {
            if (order && order.id) {
              const json = JSON.stringify(order);
              const b64 = toBase64URL(json);
              await immanuelSet(`uk09_order_${order.id}`, b64);
            }
          })
        );
      }
    } catch (e) {
      console.error(`KVSET Fallback error for ${key}:`, e);
    }
  }
}

// Helper to read store closed status directly from KV (for use inside server fn handlers)
async function isStoreClosedFromKV(): Promise<boolean> {
  const raw = await kvGet<any>("uk09_store_closed", false);
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") return raw === "true";
  return false;
}

// Server Functions
export const getOrdersServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<SyncState> => {
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const deletedOrderIds = await kvGet<string[]>("uk09_deleted_order_ids", []);
    const lastClearedAt = await kvGet<number>("uk09_last_cleared_at", 0);
    const storeClosed = await isStoreClosedFromKV();
    return { orders, deletedOrderIds, lastClearedAt, storeClosed };
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
    if (await isStoreClosedFromKV()) {
      throw new Error("Store is currently closed. Orders cannot be placed.");
    }
    const orders = await kvGet<Order[]>("uk09_orders", []);
    const updated = [data.order, ...orders];
    await kvSet("uk09_orders", updated);
    return { success: true };
  });

// Force add order without store-closed check (used for sync/re-upload only)
export const forceAddOrderServer = createServerFn({ method: "POST" })
  .validator((data: { order: Order }) => data)
  .handler(async ({ data }) => {
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

export const getStoreClosedServer = createServerFn({ method: "POST" })
  .handler(async (): Promise<boolean> => {
    return await isStoreClosedFromKV();
  });

export const setStoreClosedServer = createServerFn({ method: "POST" })
  .validator((data: boolean) => data)
  .handler(async ({ data: closed }) => {
    const isClosed = typeof closed === "boolean" ? closed : String(closed) === "true";
    await kvSet("uk09_store_closed", isClosed);
    return { success: true, storeClosed: isClosed };
  });
