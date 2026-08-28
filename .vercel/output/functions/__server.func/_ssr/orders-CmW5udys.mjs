import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as setOrdersServer, n as getOrdersServer, t as clearAdminOrdersServer } from "./db-BN3aOrq2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CmW5udys.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var emptyOrders = [];
var OrderStore = class {
	serverOrders = [];
	adminDeletedOrderIds = [];
	adminLastClearedAt = 0;
	customerOrders = [];
	customerDeletedOrderIds = [];
	customerLastClearedAt = 0;
	listeners = [];
	constructor() {
		if (typeof window !== "undefined") {
			setTimeout(() => {
				const savedCustomerOrders = localStorage.getItem("uk09_my_orders") || localStorage.getItem("uk09_orders");
				if (savedCustomerOrders) try {
					this.customerOrders = JSON.parse(savedCustomerOrders);
				} catch {}
				const savedCustDeleted = localStorage.getItem("uk09_customer_deleted_order_ids");
				if (savedCustDeleted) try {
					this.customerDeletedOrderIds = JSON.parse(savedCustDeleted);
				} catch {}
				const savedCustCleared = localStorage.getItem("uk09_customer_last_cleared");
				if (savedCustCleared) this.customerLastClearedAt = Number(savedCustCleared) || 0;
				const savedAdminDeleted = localStorage.getItem("uk09_admin_deleted_order_ids");
				if (savedAdminDeleted) try {
					this.adminDeletedOrderIds = JSON.parse(savedAdminDeleted);
				} catch {}
				const savedAdminCleared = localStorage.getItem("uk09_admin_last_cleared");
				if (savedAdminCleared) this.adminLastClearedAt = Number(savedAdminCleared) || 0;
				this.filterCustomerOrders();
				this.syncFromServer();
				this.notify();
			}, 0);
			setInterval(() => {
				this.syncFromServer();
			}, 4e3);
		}
	}
	filterCustomerOrders() {
		this.customerOrders = this.customerOrders.filter((o) => {
			if (this.customerDeletedOrderIds.includes(o.id)) return false;
			if (this.customerLastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.customerLastClearedAt) return false;
			return true;
		});
	}
	async syncFromServer() {
		try {
			const syncState = await getOrdersServer();
			if (!syncState) return;
			const { orders: remoteOrders = [], adminDeletedOrderIds: remoteAdminDeleted = [], adminLastClearedAt: remoteAdminCleared = 0 } = syncState;
			let hasChanges = false;
			if (remoteAdminCleared > this.adminLastClearedAt) {
				this.adminLastClearedAt = remoteAdminCleared;
				hasChanges = true;
			}
			if (remoteAdminDeleted.length > 0) {
				const set = new Set(this.adminDeletedOrderIds);
				for (const id of remoteAdminDeleted) if (!set.has(id)) {
					this.adminDeletedOrderIds.push(id);
					hasChanges = true;
				}
			}
			this.serverOrders = remoteOrders;
			const remoteOrderMap = /* @__PURE__ */ new Map();
			for (const rOrder of remoteOrders) remoteOrderMap.set(rOrder.id, rOrder);
			let customerOrdersUpdated = false;
			const updatedCustomerOrders = this.customerOrders.map((custOrder) => {
				const matchingRemote = remoteOrderMap.get(custOrder.id);
				if (matchingRemote && matchingRemote.status !== custOrder.status) {
					customerOrdersUpdated = true;
					return {
						...custOrder,
						status: matchingRemote.status
					};
				}
				return custOrder;
			});
			if (customerOrdersUpdated) {
				this.customerOrders = updatedCustomerOrders;
				hasChanges = true;
			}
			if (hasChanges) this.notify();
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
	subscribe = (listener) => {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	};
	getCustomerSnapshot = () => this.customerOrders;
	getAdminSnapshot = () => {
		return this.serverOrders.filter((o) => {
			if (this.adminDeletedOrderIds.includes(o.id)) return false;
			if (this.adminLastClearedAt && o.createdAtTimestamp && o.createdAtTimestamp <= this.adminLastClearedAt) return false;
			return true;
		});
	};
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
		this.customerOrders = [newOrder, ...this.customerOrders];
		this.serverOrders = [newOrder, ...this.serverOrders];
		this.notify();
		setOrdersServer({ data: {
			orders: this.serverOrders,
			adminDeletedOrderIds: this.adminDeletedOrderIds,
			adminLastClearedAt: this.adminLastClearedAt
		} }).catch((e) => console.error("Server save failed on addOrder:", e));
		return newOrder;
	};
	cancelOrder = (id) => {
		this.customerOrders = this.customerOrders.map((o) => o.id === id ? {
			...o,
			status: "Cancelled"
		} : o);
		this.serverOrders = this.serverOrders.map((o) => o.id === id ? {
			...o,
			status: "Cancelled"
		} : o);
		this.notify();
		setOrdersServer({ data: {
			orders: this.serverOrders,
			adminDeletedOrderIds: this.adminDeletedOrderIds,
			adminLastClearedAt: this.adminLastClearedAt
		} }).catch((e) => console.error("Server save failed on cancelOrder:", e));
	};
	updateOrderStatus = (id, status) => {
		this.customerOrders = this.customerOrders.map((o) => o.id === id ? {
			...o,
			status
		} : o);
		this.serverOrders = this.serverOrders.map((o) => o.id === id ? {
			...o,
			status
		} : o);
		this.notify();
		setOrdersServer({ data: {
			orders: this.serverOrders,
			adminDeletedOrderIds: this.adminDeletedOrderIds,
			adminLastClearedAt: this.adminLastClearedAt
		} }).catch((e) => console.error("Server save failed on updateOrderStatus:", e));
	};
	deleteCustomerOrder = (id) => {
		this.customerOrders = this.customerOrders.filter((o) => o.id !== id);
		if (!this.customerDeletedOrderIds.includes(id)) this.customerDeletedOrderIds.push(id);
		this.notify();
	};
	clearCustomerOrders = () => {
		const now = Date.now();
		this.customerOrders = [];
		this.customerDeletedOrderIds = [];
		this.customerLastClearedAt = now;
		this.notify();
	};
	deleteAdminOrder = (id) => {
		if (!this.adminDeletedOrderIds.includes(id)) this.adminDeletedOrderIds.push(id);
		this.notify();
		setOrdersServer({ data: {
			orders: this.serverOrders,
			adminDeletedOrderIds: this.adminDeletedOrderIds,
			adminLastClearedAt: this.adminLastClearedAt
		} }).catch((e) => console.error("Server save failed on deleteAdminOrder:", e));
	};
	clearAdminOrders = () => {
		const now = Date.now();
		this.adminLastClearedAt = now;
		this.adminDeletedOrderIds = [];
		this.notify();
		clearAdminOrdersServer().catch((e) => console.error("Server clearAdminOrders failed:", e));
	};
	restoreOrdersByPhoneOrId = (query) => {
		const cleanQuery = query.trim().toLowerCase();
		if (!cleanQuery) return;
		const matches = this.serverOrders.filter((o) => {
			const matchId = o.id.toLowerCase() === cleanQuery || o.id.toLowerCase() === `uk09-${cleanQuery}`;
			const matchPhone = o.phone.replace(/\s/g, "") === cleanQuery.replace(/\s/g, "");
			return matchId || matchPhone;
		});
		if (matches.length > 0) {
			let addedAny = false;
			const currentIds = new Set(this.customerOrders.map((o) => o.id));
			const newCustOrders = [...this.customerOrders];
			for (const match of matches) if (!currentIds.has(match.id)) {
				if (!this.customerDeletedOrderIds.includes(match.id)) {
					newCustOrders.push(match);
					addedAny = true;
				}
			}
			if (addedAny) {
				newCustOrders.sort((a, b) => (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0));
				this.customerOrders = newCustOrders;
				this.notify();
			}
		}
	};
};
var orderStore = new OrderStore();
function useOrders() {
	const customerOrders = (0, import_react.useSyncExternalStore)(orderStore.subscribe, orderStore.getCustomerSnapshot, orderStore.getServerSnapshot);
	return {
		orders: customerOrders,
		customerOrders,
		adminOrders: (0, import_react.useSyncExternalStore)(orderStore.subscribe, orderStore.getAdminSnapshot, orderStore.getServerSnapshot),
		addOrder: orderStore.addOrder,
		cancelOrder: orderStore.cancelOrder,
		updateOrderStatus: orderStore.updateOrderStatus,
		deleteOrder: orderStore.deleteCustomerOrder,
		deleteCustomerOrder: orderStore.deleteCustomerOrder,
		clearCustomerOrders: orderStore.clearCustomerOrders,
		clearAllOrders: orderStore.clearCustomerOrders,
		deleteAdminOrder: orderStore.deleteAdminOrder,
		clearAdminOrders: orderStore.clearAdminOrders,
		restoreOrdersByPhoneOrId: orderStore.restoreOrdersByPhoneOrId
	};
}
//#endregion
export { useOrders as t };
