import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-Cx1mweoL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var emptyArray = [];
var CartStore = class {
	items = [];
	listeners = [];
	constructor() {
		if (typeof window !== "undefined") setTimeout(() => {
			const saved = localStorage.getItem("uk09_cart");
			if (saved) try {
				this.items = JSON.parse(saved);
				this.notify();
			} catch {}
		}, 0);
	}
	save() {
		if (typeof window !== "undefined") localStorage.setItem("uk09_cart", JSON.stringify(this.items));
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
	getSnapshot = () => this.items;
	getServerSnapshot = () => emptyArray;
	addItem = (item) => {
		if (this.items.find((i) => i.id === item.id)) this.items = this.items.map((i) => i.id === item.id ? {
			...i,
			quantity: i.quantity + 1
		} : i);
		else this.items = [...this.items, {
			...item,
			quantity: 1
		}];
		this.notify();
	};
	removeItem = (id) => {
		this.items = this.items.filter((i) => i.id !== id);
		this.notify();
	};
	updateQuantity = (id, quantity) => {
		if (quantity <= 0) {
			this.removeItem(id);
			return;
		}
		this.items = this.items.map((i) => i.id === id ? {
			...i,
			quantity
		} : i);
		this.notify();
	};
	clearCart = () => {
		this.items = [];
		this.notify();
	};
};
var cartStore = new CartStore();
function useCart() {
	const items = (0, import_react.useSyncExternalStore)(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
	return {
		items,
		total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
		itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
		addItem: cartStore.addItem,
		removeItem: cartStore.removeItem,
		updateQuantity: cartStore.updateQuantity,
		clearCart: cartStore.clearCart
	};
}
//#endregion
export { useCart as t };
