import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Clock, D as Bike, E as ChefHat, T as CircleCheckBig, a as Trash2, k as ArrowLeft, r as TriangleAlert, s as ShoppingBag, u as Search, w as CircleX } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useOrders } from "./orders-CmW5udys.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-orders-DiN9OTHQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function MyOrdersPage() {
	const { customerOrders: orders, cancelOrder, deleteCustomerOrder, clearCustomerOrders, restoreOrdersByPhoneOrId } = useOrders();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [cancellingId, setCancellingId] = (0, import_react.useState)(null);
	const handleCancelOrderClick = (orderId) => {
		cancelOrder(orderId);
		setCancellingId(null);
		toast.error(`Order ${orderId} has been cancelled.`);
	};
	const handleClearHistory = () => {
		if (confirm("Are you sure you want to clear your order history from this device? This will only remove history from your view.")) {
			clearCustomerOrders();
			toast.success("Your order history has been cleared.");
		}
	};
	const filteredOrders = orders.filter((o) => o.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) || o.phone.includes(searchQuery.trim()) || o.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pt-24 md:pt-28 pb-20 min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell max-w-5xl mx-auto space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/order",
							className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back to Order Page"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-foreground",
							children: "My Orders & History"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs md:text-sm text-muted-foreground mt-1",
							children: "Your previous order records are safely stored here on your device."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleClearHistory,
							className: "inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-sm transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear My History"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/order",
							className: "inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 text-xs uppercase tracking-wider rounded-sm transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-3.5" }), "Place New Order"]
						})]
					})]
				}),
				orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search Order ID, Phone or Name...",
							value: searchQuery,
							onChange: (e) => {
								const val = e.target.value;
								setSearchQuery(val);
								if (val.trim().length >= 4) restoreOrdersByPhoneOrId(val);
							},
							className: "w-full pl-10 pr-4 py-2 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 rounded-sm border border-border focus:border-primary focus:outline-none"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground font-medium",
						children: [
							"Showing",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-bold",
								children: filteredOrders.length
							}),
							" ",
							"of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-bold",
								children: orders.length
							}),
							" ",
							"orders"
						]
					})]
				}),
				filteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-sm border border-border bg-card p-8 md:p-12 text-center my-8 space-y-6 max-w-lg mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto size-12 text-muted-foreground/40 mb-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold uppercase tracking-tight",
								children: "No Local Orders Found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-2",
								children: searchQuery ? "No previous orders matched your search. Try another Order ID or Phone number." : "You haven't placed any orders on this browser yet, or your local history was cleared."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/60 pt-6 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold uppercase tracking-wider text-primary",
									children: "Find & Restore Previous Orders"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed",
									children: "Already ordered from another device or cleared your cookies? Enter your 10-digit mobile number or Order ID to sync and track all your previous orders (both Delivered & Cancelled) from the server."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. 9876543210 or UK09-1234",
										value: searchQuery,
										onChange: (e) => {
											const val = e.target.value;
											setSearchQuery(val);
											if (val.trim().length >= 4) restoreOrdersByPhoneOrId(val);
										},
										className: "flex-1 px-3 py-2 bg-background text-xs text-foreground placeholder:text-muted-foreground/50 rounded-sm border border-border focus:border-primary focus:outline-none"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border/60 pt-6 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/order",
								className: "inline-flex items-center justify-center min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 text-xs uppercase tracking-wider rounded-sm transition-colors",
								children: "Place New Order Now"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: filteredOrders.map((order) => {
						const isCancelled = order.status === "Cancelled";
						const isDelivered = order.status === "Delivered";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-sm border border-border bg-card p-6 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-xl font-bold text-foreground",
											children: order.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border ${isCancelled ? "bg-destructive/10 text-destructive border-destructive/30" : isDelivered ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-primary/10 text-primary border-primary/30"}`,
											children: order.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: [
											"Placed at",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-medium",
												children: order.createdAt
											}),
											" ",
											"• ",
											order.name,
											" (",
											order.phone,
											")"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] uppercase font-semibold text-muted-foreground",
													children: "Total Bill"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-display text-xl font-bold text-primary",
													children: ["₹", order.total]
												})]
											}),
											!isCancelled && !isDelivered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setCancellingId(order.id),
												className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-sm transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), "Cancel"]
											}),
											(isCancelled || isDelivered) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													if (confirm(`Remove order ${order.id} from your view?`)) {
														deleteCustomerOrder(order.id);
														toast.success("Order removed from your view.");
													}
												},
												className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2.5 py-1.5 rounded-sm transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear"]
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
											children: "Yes, Cancel Order"
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
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4",
										children: "Live Order Progress Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-2",
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
													className: `text-[10px] md:text-[11px] font-semibold tracking-tight ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}`,
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
												"x",
												" ",
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
											className: "pt-2 border-t border-border/50 flex justify-between font-medium text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[11px]",
												children: "Delivery Address"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground text-[11px] max-w-xs truncate text-right",
												children: order.address
											})]
										})
									]
								})
							]
						}, order.id);
					})
				})
			]
		})
	});
}
//#endregion
export { MyOrdersPage as component };
