import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as business } from "./business-DZM1jd34.mjs";
import { C as Clock, D as ChefHat, O as Bike, S as LoaderCircle, T as CircleCheckBig, a as Trash2, f as Plus, m as Minus, n as User, p as Phone, r as TriangleAlert, s as ShoppingBag, u as Search, w as CircleX, y as MapPin } from "../_libs/lucide-react.mjs";
import { n as Reveal, t as CTASection } from "./CTASection-Pmk0H9N2.mjs";
import { _ as useSearch, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useOrders } from "./orders-CmW5udys.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useCart } from "./cart-Cx1mweoL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-dbvgVwFv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function validate(form) {
	const errors = {};
	if (!form.name.trim()) errors.name = "Name is required.";
	else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
	const phoneClean = form.phone.replace(/\s/g, "");
	if (!phoneClean) errors.phone = "Phone number is required.";
	else if (!/^[6-9]\d{9}$/.test(phoneClean)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
	if (!form.address.trim()) errors.address = "Delivery address is required.";
	else if (form.address.trim().length < 10) errors.address = "Please enter a complete address (at least 10 characters).";
	return errors;
}
var statusSteps = [
	{
		key: "Received",
		label: "Order Received",
		icon: Clock
	},
	{
		key: "Preparing",
		label: "Preparing",
		icon: ChefHat
	},
	{
		key: "Out for Delivery",
		label: "Out for Delivery",
		icon: Bike
	},
	{
		key: "Delivered",
		label: "Delivered",
		icon: CircleCheckBig
	}
];
function OrderFormSection() {
	const search = useSearch({ from: "/order" });
	const { items, total, removeItem, updateQuantity, clearCart } = useCart();
	const { orders, addOrder, cancelOrder, deleteOrder, clearAllOrders, restoreOrdersByPhoneOrId } = useOrders();
	const [activeTab, setActiveTab] = (0, import_react.useState)("order");
	(0, import_react.useEffect)(() => {
		if (search && (search.tab === "track" || search.tab === "order")) setActiveTab(search.tab);
	}, [search]);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		address: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [touched, setTouched] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [lastPlacedOrder, setLastPlacedOrder] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [cancellingId, setCancellingId] = (0, import_react.useState)(null);
	const [isStoreClosed, setIsStoreClosed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const closed = localStorage.getItem("uk09_store_closed") === "true";
			setIsStoreClosed(closed);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const onStorage = (e) => {
			if (e.key === "uk09_admin_notifications" && e.newValue) try {
				const notifications = JSON.parse(e.newValue);
				const lastSeen = Number(localStorage.getItem("uk09_notifications_seen") || "0");
				const fresh = notifications.filter((n) => n.type === "cancelled_by_admin" && n.timestamp > lastSeen);
				fresh.forEach((n) => {
					toast.error(n.message, {
						duration: 8e3,
						description: `Order ID: ${n.orderId} — Please contact us at ${business.phoneDisplay} for assistance.`
					});
				});
				if (fresh.length > 0) localStorage.setItem("uk09_notifications_seen", String(Date.now()));
			} catch {}
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);
	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value
		}));
		if (touched[field]) {
			const newErrors = validate({
				...form,
				[field]: value
			});
			setErrors((prev) => ({
				...prev,
				[field]: newErrors[field]
			}));
		}
	};
	const handleBlur = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true
		}));
		const newErrors = validate(form);
		setErrors((prev) => ({
			...prev,
			[field]: newErrors[field]
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isStoreClosed) {
			toast.error("We are currently closed for online orders. Please call us directly!");
			return;
		}
		setTouched({
			name: true,
			phone: true,
			address: true
		});
		const newErrors = validate(form);
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) {
			toast.error("Please fix the errors before placing your order.");
			return;
		}
		if (items.length === 0) {
			toast.error("Your cart is empty. Add items from the menu first!");
			return;
		}
		setSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		const newOrder = addOrder({
			name: form.name.trim(),
			phone: form.phone.trim(),
			address: form.address.trim(),
			items: [...items],
			total
		});
		setSubmitting(false);
		setLastPlacedOrder(newOrder);
		clearCart();
		toast.success(`Order ${newOrder.id} placed! We will call you shortly.`);
	};
	const handleNewOrder = () => {
		setForm({
			name: "",
			phone: "",
			address: ""
		});
		setErrors({});
		setTouched({});
		setLastPlacedOrder(null);
		setActiveTab("order");
	};
	const handleCancelOrderClick = (orderId) => {
		cancelOrder(orderId);
		setCancellingId(null);
		toast.error(`Order ${orderId} has been cancelled.`);
	};
	const filteredOrders = orders.filter((o) => o.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) || o.phone.includes(searchQuery.trim()) || o.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-12 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell max-w-5xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-2 mb-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex flex-wrap rounded-sm border border-border bg-card p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("order"),
								className: `flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors rounded-sm ${activeTab === "order" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }),
									"Place Order ",
									items.length > 0 && `(${items.length})`
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("track"),
								className: `flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors rounded-sm ${activeTab === "track" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
									"Track & Cancel Order ",
									orders.length > 0 && `(${orders.length})`
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/my-orders",
								className: "flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors rounded-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-primary" }), "My Orders History"]
							})
						]
					})
				}),
				activeTab === "order" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: lastPlacedOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "mx-auto max-w-lg text-center py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, {
							className: "mx-auto size-16 text-primary",
							strokeWidth: 1.5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 font-display text-4xl font-extrabold uppercase tracking-tight",
							children: "Order Confirmed!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs uppercase tracking-widest text-primary font-bold",
							children: ["Order ID: ", lastPlacedOrder.id]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-muted-foreground leading-relaxed text-sm",
							children: [
								"Thank you, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-semibold",
									children: lastPlacedOrder.name
								}),
								"! Your order request has been received. Our team will call you at",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-semibold",
									children: lastPlacedOrder.phone
								}),
								" shortly to confirm."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-sm border border-border bg-card p-5 text-left text-sm text-muted-foreground space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground text-xs uppercase tracking-wider mb-3",
									children: "Order Summary"
								}),
								lastPlacedOrder.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										item.quantity,
										"x ",
										item.name,
										" ",
										item.portion && `(${item.portion})`
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-foreground font-medium",
										children: ["₹", item.price * item.quantity]
									})]
								}, idx)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border flex justify-between font-bold text-foreground text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-primary",
										children: ["₹", lastPlacedOrder.total]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("track"),
								className: "inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm",
								children: "Track Order"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleNewOrder,
								className: "inline-flex items-center justify-center min-h-12 border border-border hover:border-primary hover:text-primary px-8 text-xs font-semibold uppercase tracking-[0.16em] transition-colors rounded-sm",
								children: "Place Another Order"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Fresh & Quick"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-4 text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none font-display font-extrabold",
								children: [
									"Place Your",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Order"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground",
								children: "Review your selected items and fill in your contact details below to place your order with UK 09."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary",
											children: "1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Select Menu Items"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: "Add your favorite dishes from our digital menu."
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary",
											children: "2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Provide Delivery Info"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: "Enter your name, 10-digit mobile number, and address."
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary",
											children: "3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Instant Call Confirmation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: "Our staff will call you to confirm & dispatch your food."
										})] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 rounded-sm border border-border/60 bg-card p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3",
										children: "Prefer to Order via Call or WhatsApp?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: business.phoneHref,
										className: "flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-primary shrink-0" }), business.phoneDisplay]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: business.whatsappHref,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-2 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4 text-primary shrink-0" }), "WhatsApp Us Directly"]
									})
								]
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-7",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-sm border border-border bg-card p-12 text-center flex flex-col items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-16 rounded-full bg-secondary flex items-center justify-center mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-8 text-muted-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold uppercase tracking-tight",
									children: "Your Cart is Empty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground max-w-sm mb-6",
									children: "Looks like you haven't added any dishes yet. Browse our menu to add items!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/menu",
									className: "inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm",
									children: "Explore Menu"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							noValidate: true,
							className: "rounded-sm border border-border bg-card p-6 md:p-8 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-bold uppercase tracking-tight",
											children: "Selected Items"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground font-semibold uppercase",
										children: [items.length, " Items"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3 max-h-60 overflow-y-auto pr-1 hide-scrollbar",
									children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 py-2.5 border-b border-border/40 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-bold text-foreground",
												children: [
													item.name,
													" ",
													item.portion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs font-normal text-muted-foreground",
														children: [
															"(",
															item.portion,
															")"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-primary font-semibold",
												children: ["₹", item.price]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center border border-border rounded-sm overflow-hidden bg-background",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => updateQuantity(item.id, item.quantity - 1),
														className: "size-6 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-7 text-center text-xs font-semibold",
														children: item.quantity
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => updateQuantity(item.id, item.quantity + 1),
														className: "size-6 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeItem(item.id),
												className: "size-6 flex items-center justify-center rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors",
												title: "Remove",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})]
										})]
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center bg-secondary/50 p-3.5 rounded-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Total Bill"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-xl font-bold text-primary",
										children: ["₹", total]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 border-t border-border space-y-4",
									children: [
										isStoreClosed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-sm border border-destructive bg-destructive/10 text-destructive text-xs flex items-center gap-2 mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notice: We are currently closed and not accepting online orders at this time. Please contact us directly by phone or try again later." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-sm font-bold uppercase tracking-wider",
												children: "Customer Details"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "order-name",
												className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5",
												children: ["Full Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													id: "order-name",
													autoComplete: "name",
													value: form.name,
													onChange: (e) => handleChange("name", e.target.value),
													onBlur: () => handleBlur("name"),
													placeholder: "e.g. Arjun Singh",
													className: `w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none ${errors.name && touched.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
												})]
											}),
											errors.name && touched.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-destructive",
												children: errors.name
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "order-phone",
												className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5",
												children: ["Phone Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "tel",
													id: "order-phone",
													autoComplete: "tel",
													value: form.phone,
													onChange: (e) => handleChange("phone", e.target.value),
													onBlur: () => handleBlur("phone"),
													placeholder: "e.g. 9876543210",
													maxLength: 10,
													className: `w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none ${errors.phone && touched.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
												})]
											}),
											errors.phone && touched.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-destructive",
												children: errors.phone
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "order-address",
												className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5",
												children: ["Delivery Address ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "absolute left-3.5 top-3.5 size-4 text-muted-foreground/50 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													id: "order-address",
													autoComplete: "street-address",
													value: form.address,
													onChange: (e) => handleChange("address", e.target.value),
													onBlur: () => handleBlur("address"),
													placeholder: "House no., Street, Area, Landmark, Bathinda...",
													rows: 3,
													className: `w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none resize-none ${errors.address && touched.address ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
												})]
											}),
											errors.address && touched.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-destructive",
												children: errors.address
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: submitting || isStoreClosed,
											className: "w-full flex items-center justify-center gap-2.5 min-h-13 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-bold px-8 text-xs uppercase tracking-[0.18em] transition-colors rounded-sm",
											children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Processing Order…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), isStoreClosed ? "Closed for Orders" : `Place Order (₹${total})`] })
										})
									]
								})
							]
						}) })
					})]
				}) }),
				activeTab === "track" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-extrabold uppercase tracking-tight",
							children: "Track & Cancel Orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "View real-time progress or cancel active orders."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Search Order ID / Phone...",
									onChange: (e) => {
										const val = e.target.value;
										setSearchQuery(val);
										if (val.trim().length >= 4) restoreOrdersByPhoneOrId(val);
									},
									className: "w-full pl-9 pr-4 py-2 bg-card text-xs text-foreground placeholder:text-muted-foreground/60 rounded-sm border border-border focus:border-primary focus:outline-none"
								})]
							}), orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (confirm("Are you sure you want to clear your order history from this device? (This only removes history on your device view)")) {
										clearAllOrders();
										toast.success("Order history cleared from your device view.");
									}
								},
								className: "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-sm transition-colors",
								title: "Clear all orders from your view",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear My History"]
							})]
						})]
					}), filteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-sm border border-border bg-card p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto size-12 text-muted-foreground/50 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-lg font-bold uppercase",
								children: "No Orders Found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
								children: searchQuery ? "No orders matched your search query. Try typing your 10-digit mobile number or Order ID." : "You haven't placed any orders yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("order"),
								className: "mt-6 inline-flex items-center justify-center min-h-11 bg-primary text-primary-foreground font-semibold px-6 text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors",
								children: "Place New Order"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: filteredOrders.map((order) => {
							const isCancelled = order.status === "Cancelled";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-sm border border-border bg-card p-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-lg font-bold text-foreground",
												children: order.id
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${isCancelled ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-primary/10 text-primary border-primary/30"}`,
												children: order.status
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: [
												"Placed at ",
												order.createdAt,
												" • Customer: ",
												order.name,
												" (",
												order.phone,
												")"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-display text-lg font-bold text-primary",
													children: ["₹", order.total]
												}),
												!isCancelled && order.status !== "Delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setCancellingId(order.id),
													className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-sm transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), "Cancel Order"]
												}),
												(isCancelled || order.status === "Delivered") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														if (confirm(`Remove order ${order.id} from your view?`)) {
															deleteOrder(order.id);
															toast.success("Order record cleared from your device.");
														}
													},
													className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2.5 py-1.5 rounded-sm transition-colors",
													title: "Delete this order record from your device",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear Record"]
												})
											]
										})]
									}),
									cancellingId === order.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-sm border border-destructive/40 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 text-xs text-destructive font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Are you sure you want to cancel order ",
												order.id,
												"?"
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleCancelOrderClick(order.id),
												className: "px-4 py-1.5 bg-destructive text-destructive-foreground font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-destructive/90 transition-colors",
												children: "Yes, Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setCancellingId(null),
												className: "px-4 py-1.5 border border-border text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors",
												children: "Dismiss"
											})]
										})]
									}),
									!isCancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4",
											children: "Live Order Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-4 gap-2 relative",
											children: statusSteps.map((step, idx) => {
												const StepIcon = step.icon;
												const isCurrent = order.status === step.key;
												const isCompleted = order.status === "Preparing" && idx === 0 || order.status === "Out for Delivery" && idx <= 1 || order.status === "Delivered" && idx <= 3;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col items-center text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `size-10 rounded-full flex items-center justify-center transition-colors mb-2 border ${isCurrent ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 animate-pulse" : isCompleted ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIcon, { className: "size-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[11px] font-semibold tracking-tight ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}`,
														children: step.label
													})]
												}, step.key);
											})
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-sm bg-destructive/10 text-destructive text-xs flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "This order was cancelled. No further charges or delivery will occur." })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-secondary/30 p-4 rounded-sm space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold text-foreground uppercase tracking-wider text-[10px] mb-2",
												children: [
													"Items Ordered (",
													order.items.length,
													")"
												]
											}),
											order.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													item.quantity,
													"x ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-foreground",
														children: item.name
													}),
													" ",
													item.portion && `(${item.portion})`
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium text-foreground",
													children: ["₹", item.price * item.quantity]
												})]
											}, i)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 border-t border-border/50 flex justify-between font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground font-normal max-w-xs truncate",
													children: order.address
												})]
											})
										]
									})
								]
							}, order.id);
						})
					})]
				})
			]
		})
	});
}
function OrderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-20 md:pt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderFormSection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})]
	});
}
//#endregion
export { OrderPage as component };
