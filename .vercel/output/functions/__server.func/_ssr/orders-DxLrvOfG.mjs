import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as setOrdersServer, t as getOrdersServer } from "./db-BgJMkMYJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DxLrvOfG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var emptyOrders = [];
var OrderStore = class {
	orders = [];
	listeners = [];
	constructor() {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("uk09_orders");
			if (saved) try {
				this.orders = JSON.parse(saved);
			} catch {}
			this.syncFromServer();
			setInterval(() => {
				this.syncFromServer();
			}, 5e3);
		}
	}
	async syncFromServer() {
		try {
			const serverOrders = await getOrdersServer();
			if ((!serverOrders || serverOrders.length === 0) && this.orders.length > 0) {
				setOrdersServer({ data: this.orders }).catch(() => {});
				return;
			}
			if (!serverOrders) return;
			let changed = false;
			const orderMap = /* @__PURE__ */ new Map();
			for (const localOrder of this.orders) orderMap.set(localOrder.id, localOrder);
			for (const sOrder of serverOrders) {
				const localOrder = orderMap.get(sOrder.id);
				if (!localOrder) {
					orderMap.set(sOrder.id, sOrder);
					changed = true;
				} else if (localOrder.status !== sOrder.status) {
					orderMap.set(sOrder.id, {
						...localOrder,
						status: sOrder.status
					});
					changed = true;
				}
			}
			if (changed || orderMap.size !== this.orders.length) {
				const merged = Array.from(orderMap.values());
				this.orders = merged;
				this.notify();
				setOrdersServer({ data: merged }).catch(() => {});
			}
		} catch (e) {
			console.error("Failed to sync orders from server:", e);
		}
	}
	save() {
		if (typeof window !== "undefined") localStorage.setItem("uk09_orders", JSON.stringify(this.orders));
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
		const newOrder = {
			...orderData,
			id: `UK09-${Math.floor(1e3 + Math.random() * 9e3)}`,
			status: "Received",
			createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		this.orders = [newOrder, ...this.orders];
		this.notify();
		setOrdersServer({ data: this.orders }).catch((e) => console.error("Server save failed on addOrder:", e));
		return newOrder;
	};
	cancelOrder = (id) => {
		this.orders = this.orders.map((o) => o.id === id ? {
			...o,
			status: "Cancelled"
		} : o);
		this.notify();
		setOrdersServer({ data: this.orders }).catch((e) => console.error("Server save failed on cancelOrder:", e));
	};
	updateOrderStatus = (id, status) => {
		this.orders = this.orders.map((o) => o.id === id ? {
			...o,
			status
		} : o);
		this.notify();
		setOrdersServer({ data: this.orders }).catch((e) => console.error("Server save failed on updateOrderStatus:", e));
	};
	deleteOrder = (id) => {
		this.orders = this.orders.filter((o) => o.id !== id);
		this.notify();
		setOrdersServer({ data: this.orders }).catch((e) => console.error("Server save failed on deleteOrder:", e));
	};
	clearAllOrders = () => {
		this.orders = [];
		this.notify();
		setOrdersServer({ data: this.orders }).catch((e) => console.error("Server save failed on clearAllOrders:", e));
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
