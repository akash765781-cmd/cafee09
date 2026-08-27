import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-D5iIwE3t.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var inMemoryDb = {
	orders: [],
	reviews: [],
	storeClosed: false,
	deletedOrderIds: [],
	lastClearedAt: 0
};
function getEnv(key) {
	if (typeof process !== "undefined" && process.env) return process.env[key] || "";
	return "";
}
async function kvGet(key, defaultValue) {
	const KV_URL = getEnv("KV_REST_API_URL");
	const KV_TOKEN = getEnv("KV_REST_API_TOKEN");
	if (KV_URL && KV_TOKEN) try {
		const res = await fetch(`${KV_URL}/get/${key}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
		if (res.ok) {
			const data = await res.json();
			if (data && data.result) return JSON.parse(data.result);
		}
	} catch (e) {
		console.error(`KV GET error for key ${key}:`, e);
	}
	if (key === "uk09_orders") return inMemoryDb.orders;
	if (key === "uk09_reviews") return inMemoryDb.reviews;
	if (key === "uk09_store_closed") return inMemoryDb.storeClosed;
	if (key === "uk09_deleted_order_ids") return inMemoryDb.deletedOrderIds;
	if (key === "uk09_last_cleared_at") return inMemoryDb.lastClearedAt;
	return defaultValue;
}
async function kvSet(key, value) {
	if (key === "uk09_orders") inMemoryDb.orders = value;
	if (key === "uk09_reviews") inMemoryDb.reviews = value;
	if (key === "uk09_store_closed") inMemoryDb.storeClosed = value;
	if (key === "uk09_deleted_order_ids") inMemoryDb.deletedOrderIds = value;
	if (key === "uk09_last_cleared_at") inMemoryDb.lastClearedAt = value;
	const KV_URL = getEnv("KV_REST_API_URL");
	const KV_TOKEN = getEnv("KV_REST_API_TOKEN");
	if (KV_URL && KV_TOKEN) try {
		const res = await fetch(`${KV_URL}/set/${key}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${KV_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(JSON.stringify(value))
		});
		if (!res.ok) console.error(`KV SET status not ok for key ${key}: ${res.status}`);
	} catch (e) {
		console.error(`KV SET error for key ${key}:`, e);
	}
}
var getOrdersServer_createServerFn_handler = createServerRpc({
	id: "b881f78328db9a99ef7f3f46228f80459be5966146283324751b7dd97bcb89b5",
	name: "getOrdersServer",
	filename: "src/lib/db.ts"
}, (opts) => getOrdersServer.__executeServer(opts));
var getOrdersServer = createServerFn({ method: "GET" }).handler(getOrdersServer_createServerFn_handler, async () => {
	return {
		orders: await kvGet("uk09_orders", []),
		deletedOrderIds: await kvGet("uk09_deleted_order_ids", []),
		lastClearedAt: await kvGet("uk09_last_cleared_at", 0)
	};
});
var setOrdersServer_createServerFn_handler = createServerRpc({
	id: "ca01e43fc423852eeb520611f252838c66f748acad7a279e4c685d20177299f3",
	name: "setOrdersServer",
	filename: "src/lib/db.ts"
}, (opts) => setOrdersServer.__executeServer(opts));
var setOrdersServer = createServerFn({ method: "POST" }).handler(setOrdersServer_createServerFn_handler, async ({ data }) => {
	await kvSet("uk09_orders", data.orders);
	if (data.deletedOrderIds) await kvSet("uk09_deleted_order_ids", data.deletedOrderIds);
	if (typeof data.lastClearedAt === "number") await kvSet("uk09_last_cleared_at", data.lastClearedAt);
	return { success: true };
});
var clearAllOrdersServer_createServerFn_handler = createServerRpc({
	id: "644a36e83d83c30fe0e25987e87a9ef663178bd53530e1d9a8e9aadb65ff451e",
	name: "clearAllOrdersServer",
	filename: "src/lib/db.ts"
}, (opts) => clearAllOrdersServer.__executeServer(opts));
var clearAllOrdersServer = createServerFn({ method: "POST" }).handler(clearAllOrdersServer_createServerFn_handler, async () => {
	const now = Date.now();
	await kvSet("uk09_orders", []);
	await kvSet("uk09_deleted_order_ids", []);
	await kvSet("uk09_last_cleared_at", now);
	return {
		success: true,
		lastClearedAt: now
	};
});
var getReviewsServer_createServerFn_handler = createServerRpc({
	id: "a8ed28cb0e6f0a6718cecdbb7112403f4e2fb340b3dc121421198f4faca621f9",
	name: "getReviewsServer",
	filename: "src/lib/db.ts"
}, (opts) => getReviewsServer.__executeServer(opts));
var getReviewsServer = createServerFn({ method: "GET" }).handler(getReviewsServer_createServerFn_handler, async () => {
	return await kvGet("uk09_reviews", []);
});
var setReviewsServer_createServerFn_handler = createServerRpc({
	id: "b58704261c5442f76f2b63305982126957863a9e187c0f9bc8cca8ee92ecf0db",
	name: "setReviewsServer",
	filename: "src/lib/db.ts"
}, (opts) => setReviewsServer.__executeServer(opts));
var setReviewsServer = createServerFn({ method: "POST" }).handler(setReviewsServer_createServerFn_handler, async ({ data: reviews }) => {
	await kvSet("uk09_reviews", reviews);
	return { success: true };
});
var getStoreClosedServer_createServerFn_handler = createServerRpc({
	id: "b8bd569b48eb39bf1bda24fd0f31ccf29b3cfd06a17e0694c6605a3e8e827e8c",
	name: "getStoreClosedServer",
	filename: "src/lib/db.ts"
}, (opts) => getStoreClosedServer.__executeServer(opts));
var getStoreClosedServer = createServerFn({ method: "GET" }).handler(getStoreClosedServer_createServerFn_handler, async () => {
	return await kvGet("uk09_store_closed", false);
});
var setStoreClosedServer_createServerFn_handler = createServerRpc({
	id: "eb5c2a36344db6109f61d603ec55f05c119a17b6ef40450c147da44738dfc9e9",
	name: "setStoreClosedServer",
	filename: "src/lib/db.ts"
}, (opts) => setStoreClosedServer.__executeServer(opts));
var setStoreClosedServer = createServerFn({ method: "POST" }).handler(setStoreClosedServer_createServerFn_handler, async ({ data: closed }) => {
	await kvSet("uk09_store_closed", closed);
	return { success: true };
});
//#endregion
export { clearAllOrdersServer_createServerFn_handler, getOrdersServer_createServerFn_handler, getReviewsServer_createServerFn_handler, getStoreClosedServer_createServerFn_handler, setOrdersServer_createServerFn_handler, setReviewsServer_createServerFn_handler, setStoreClosedServer_createServerFn_handler };
