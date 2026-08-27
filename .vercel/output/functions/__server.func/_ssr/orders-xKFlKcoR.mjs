import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as setOrdersServer, n as getOrdersServer, t as clearAllOrdersServer } from "./db-BYqa_-z5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-xKFlKcoR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var emptyOrders = [];
var OrderStore = class {
	orders = [];
	deletedOrderIds = [];
	lastClearedAt = 0;
	listeners = [];
	constructor() {
		if (typeof window !== "undefined") {
			const savedOrders = localStorage.getItem("uk09_orders");
			if (savedOrders) try {
				this.orders = JSON.parse(savedOrders);
			} catch {}
			const savedDeleted = localStorage.getItem("uk09_deleted_order_ids");
			if (savedDeleted) try {
				this.deletedOrderIds = JSON.parse(savedDeleted);
			} catch {}
			const savedCleared = localStorage.getItem("uk09_last_cleared_at");
			if (savedCleared) this.lastClearedAt = Number(savedCleared) || 0;
			this.filterInvalidOrders();
			this.syncFromServer();
			setInterval(() => {
				this.syncFromServer();
			}, 5e3);
		}
	}
	filterInvalidOrders() {
		this.orders = this.orders.filter((o) => {
			if (this.deletedOrderIds.includes(o.id)) return false;
			if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) return false;
			return true;
		});
	}
	async syncFromServer() {
		try {
			const syncState = await getOrdersServer();
			if (!syncState) return;
			const { orders: serverOrders, deletedOrderIds: serverDeletedIds, lastClearedAt: serverLastCleared } = syncState;
			let hasStateChanges = false;
			if (serverLastCleared && serverLastCleared > this.lastClearedAt) {
				this.lastClearedAt = serverLastCleared;
				hasStateChanges = true;
			}
			if (serverDeletedIds && serverDeletedIds.length > 0) {
				const prevSet = new Set(this.deletedOrderIds);
				for (const id of serverDeletedIds) if (!prevSet.has(id)) {
					this.deletedOrderIds.push(id);
					hasStateChanges = true;
				}
			}
			const activeLocal = this.orders.filter((o) => {
				if (this.deletedOrderIds.includes(o.id)) return false;
				if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) return false;
				return true;
			});
			const activeServer = (serverOrders || []).filter((o) => {
				if (this.deletedOrderIds.includes(o.id)) return false;
				if (this.lastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.lastClearedAt) return false;
				return true;
			});
			const orderMap = /* @__PURE__ */ new Map();
			for (const lo of activeLocal) orderMap.set(lo.id, lo);
			for (const so of activeServer) {
				const existing = orderMap.get(so.id);
				if (!existing) {
					orderMap.set(so.id, so);
					hasStateChanges = true;
				} else if (existing.status !== so.status) {
					orderMap.set(so.id, {
						...existing,
						status: so.status
					});
					hasStateChanges = true;
				}
			}
			const merged = Array.from(orderMap.values());
			if (JSON.stringify(this.orders) !== JSON.stringify(merged) || hasStateChanges) {
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
	subscribe = (listener) => {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	};
	getSnapshot = () => this.orders;
	getServerSnapshot = () => emptyOrders;
	addOrder = (orderData) => {
		const now = Date.now();
		const newOrder = {
			...orderData,
			id: `UK09-${Math.floor(1e3 + Math.random() * 9e3)}`,
			status: "Received",
			createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}),
			createdAtTimestamp: now
		};
		this.orders = [newOrder, ...this.orders];
		this.notify();
		setOrdersServer({ data: {
			orders: this.orders,
			deletedOrderIds: this.deletedOrderIds,
			lastClearedAt: this.lastClearedAt
		} }).catch((e) => console.error("Server save failed on addOrder:", e));
		return newOrder;
	};
	cancelOrder = (id) => {
		this.orders = this.orders.map((o) => o.id === id ? {
			...o,
			status: "Cancelled"
		} : o);
		this.notify();
		setOrdersServer({ data: {
			orders: this.orders,
			deletedOrderIds: this.deletedOrderIds,
			lastClearedAt: this.lastClearedAt
		} }).catch((e) => console.error("Server save failed on cancelOrder:", e));
	};
	updateOrderStatus = (id, status) => {
		this.orders = this.orders.map((o) => o.id === id ? {
			...o,
			status
		} : o);
		this.notify();
		setOrdersServer({ data: {
			orders: this.orders,
			deletedOrderIds: this.deletedOrderIds,
			lastClearedAt: this.lastClearedAt
		} }).catch((e) => console.error("Server save failed on updateOrderStatus:", e));
	};
	deleteOrder = (id) => {
		this.orders = this.orders.filter((o) => o.id !== id);
		if (!this.deletedOrderIds.includes(id)) this.deletedOrderIds.push(id);
		this.notify();
		setOrdersServer({ data: {
			orders: this.orders,
			deletedOrderIds: this.deletedOrderIds,
			lastClearedAt: this.lastClearedAt
		} }).catch((e) => console.error("Server save failed on deleteOrder:", e));
	};
	clearAllOrders = () => {
		const now = Date.now();
		this.orders = [];
		this.deletedOrderIds = [];
		this.lastClearedAt = now;
		this.notify();
		clearAllOrdersServer().catch((e) => console.error("Server clearAllOrders failed:", e));
	};
};
var orderStore = new OrderStore();
function useOrders() {
	return {
		orders: (0, import_react.useSyncExternalStore)(orderStore.subscribe, orderStore.getSnapshot, orderStore.getServerSnapshot),
		addOrder: orderStore.addOrder,
		cancelOrder: orderStore.cancelOrder,
		updateOrderStatus: orderStore.updateOrderStatus,
		deleteOrder: orderStore.deleteOrder,
		clearAllOrders: orderStore.clearAllOrders
	};
}
//#endregion
export { useOrders as t };
