import { createServerFn } from "@tanstack/react-start";
import * as fs from "fs";
import * as path from "path";
import { Order } from "./orders";

// Types for reviews
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// In-memory fallback
let inMemoryDb = {
  orders: [] as Order[],
  reviews: [] as Review[],
  storeClosed: false
};

const DEV_DB_PATH = path.resolve(process.cwd(), ".tanstack/dev_db.json");

// Helper to load/save locally in dev
function loadLocal() {
  try {
    if (fs.existsSync(DEV_DB_PATH)) {
      const raw = fs.readFileSync(DEV_DB_PATH, "utf-8");
      inMemoryDb = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Local DB load error:", e);
  }
}

function saveLocal() {
  try {
    const dir = path.dirname(DEV_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DEV_DB_PATH, JSON.stringify(inMemoryDb, null, 2), "utf-8");
  } catch (e) {
    console.error("Local DB save error:", e);
  }
}

// Initialize on server load
if (typeof window === "undefined") {
  loadLocal();
}

// REST KV Helpers for Vercel KV
const KV_URL = process.env.KV_REST_API_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || "";

async function kvGet<T>(key: string, defaultValue: T): Promise<T> {
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          return JSON.parse(data.result) as T;
        }
      }
    } catch (e) {
      console.error(`KV GET error for key ${key}:`, e);
    }
  }
  
  // Fallback to in-memory/local
  if (key === "uk09_orders") return inMemoryDb.orders as any;
  if (key === "uk09_reviews") return inMemoryDb.reviews as any;
  if (key === "uk09_store_closed") return inMemoryDb.storeClosed as any;
  return defaultValue;
}

async function kvSet(key: string, value: any) {
  // Update local memory
  if (key === "uk09_orders") inMemoryDb.orders = value;
  if (key === "uk09_reviews") inMemoryDb.reviews = value;
  if (key === "uk09_store_closed") inMemoryDb.storeClosed = value;
  
  // Save local file
  saveLocal();

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
  .handler(async (): Promise<Order[]> => {
    return await kvGet<Order[]>("uk09_orders", []);
  });

export const setOrdersServer = createServerFn({ method: "POST" })
  .handler(async ({ data: orders }: { data: Order[] }) => {
    await kvSet("uk09_orders", orders);
    return { success: true };
  });

export const getReviewsServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<Review[]> => {
    return await kvGet<Review[]>("uk09_reviews", []);
  });

export const setReviewsServer = createServerFn({ method: "POST" })
  .handler(async ({ data: reviews }: { data: Review[] }) => {
    await kvSet("uk09_reviews", reviews);
    return { success: true };
  });

export const getStoreClosedServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<boolean> => {
    return await kvGet<boolean>("uk09_store_closed", false);
  });

export const setStoreClosedServer = createServerFn({ method: "POST" })
  .handler(async ({ data: closed }: { data: boolean }) => {
    await kvSet("uk09_store_closed", closed);
    return { success: true };
  });
