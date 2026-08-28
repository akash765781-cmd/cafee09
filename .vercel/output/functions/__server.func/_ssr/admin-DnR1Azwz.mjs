import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Trash2, b as LogOut, c as Shield, d as RefreshCw, h as MessageSquare, i as TrendingUp, l as Settings, n as User, s as ShoppingBag, w as CircleX, x as Lock } from "../_libs/lucide-react.mjs";
import { i as getStoreClosedServer, o as setReviewsServer, r as getReviewsServer, s as setStoreClosedServer } from "./db-BN3aOrq2.mjs";
import { t as useOrders } from "./orders-CmW5udys.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DnR1Azwz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { adminOrders: orders, updateOrderStatus, deleteAdminOrder, clearAdminOrders, cancelOrder } = useOrders();
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(false);
	const [usernameInput, setUsernameInput] = (0, import_react.useState)("");
	const [passwordInput, setPasswordInput] = (0, import_react.useState)("");
	const [authError, setAuthError] = (0, import_react.useState)("");
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [isStoreClosed, setIsStoreClosed] = (0, import_react.useState)(false);
	const [simulatedVisitors, setSimulatedVisitors] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			if (sessionStorage.getItem("uk09_admin_authenticated") === "true") setIsAuthenticated(true);
			getReviewsServer().then((serverReviews) => {
				if (serverReviews && serverReviews.length > 0) {
					setReviews(serverReviews);
					localStorage.setItem("uk09_reviews", JSON.stringify(serverReviews));
				} else {
					const savedReviews = localStorage.getItem("uk09_reviews");
					if (savedReviews) try {
						setReviews(JSON.parse(savedReviews));
					} catch {}
				}
			});
			getStoreClosedServer().then((closed) => {
				setIsStoreClosed(closed);
				localStorage.setItem("uk09_store_closed", String(closed));
			});
			setSimulatedVisitors(Math.floor(124 + Math.random() * 800));
		}
	}, []);
	const handleLogin = (e) => {
		e.preventDefault();
		if (usernameInput === "akashdeep" && passwordInput === "password") {
			setIsAuthenticated(true);
			sessionStorage.setItem("uk09_admin_authenticated", "true");
			toast.success("Welcome back, Akashdeep!");
			setAuthError("");
		} else {
			setAuthError("Invalid username or password.");
			toast.error("Access Denied");
		}
	};
	const handleLogout = () => {
		setIsAuthenticated(false);
		sessionStorage.removeItem("uk09_admin_authenticated");
		toast.info("Logged out successfully.");
	};
	const toggleStoreStatus = async () => {
		const nextState = !isStoreClosed;
		setIsStoreClosed(nextState);
		localStorage.setItem("uk09_store_closed", String(nextState));
		try {
			await setStoreClosedServer({ data: nextState });
			toast.success(nextState ? "Store status set to CLOSED. Customers will see a warning." : "Store status set to OPEN.");
		} catch (e) {
			console.error("Failed to sync store status to server:", e);
			toast.error("Failed to sync status to server.");
		}
	};
	const handleDeleteReview = async (index) => {
		const updated = reviews.filter((_, idx) => idx !== index);
		setReviews(updated);
		localStorage.setItem("uk09_reviews", JSON.stringify(updated));
		try {
			await setReviewsServer({ data: updated });
			toast.success("Review deleted successfully.");
		} catch (e) {
			console.error("Failed to delete review on server:", e);
		}
	};
	const handleAdminCancelOrder = (orderId, customerName) => {
		if (!confirm(`Cancel order ${orderId} for ${customerName}? The customer will be notified.`)) return;
		cancelOrder(orderId);
		const notifications = JSON.parse(localStorage.getItem("uk09_admin_notifications") || "[]");
		notifications.push({
			orderId,
			type: "cancelled_by_admin",
			message: `Your order ${orderId} has been cancelled by the restaurant. Please call us for more details.`,
			timestamp: Date.now()
		});
		localStorage.setItem("uk09_admin_notifications", JSON.stringify(notifications));
		toast.success(`Order ${orderId} cancelled. Customer will be notified.`);
	};
	const handleResetReviews = async () => {
		if (confirm("Are you sure you want to reset all reviews to default settings?")) {
			localStorage.removeItem("uk09_reviews");
			setReviews([]);
			try {
				await setReviewsServer({ data: [] });
				toast.success("Reviews database reset.");
			} catch (e) {
				console.error("Failed to reset reviews on server:", e);
			}
		}
	};
	const handleResetOrders = () => {
		if (confirm("Are you sure you want to delete all order records from Admin panel? (Customer history will remain safe)")) {
			clearAdminOrders();
			toast.success("Admin order panel cleared.");
		}
	};
	const placedOrdersCount = orders.length;
	const cancelledOrdersCount = orders.filter((o) => o.status === "Cancelled").length;
	const activeOrdersCount = orders.filter((o) => o.status !== "Cancelled" && o.status !== "Delivered").length;
	const totalRevenue = orders.filter((o) => o.status !== "Cancelled").reduce((acc, o) => acc + o.total, 0);
	const avgReviewRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen pt-28 flex items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-card border border-border rounded-sm p-8 shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex size-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold uppercase tracking-tight text-foreground",
						children: "Admin Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-2",
						children: "Authentication required to view system configuration and order data."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleLogin,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "username",
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
						children: "Username"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							id: "username",
							value: usernameInput,
							onChange: (e) => setUsernameInput(e.target.value),
							placeholder: "e.g. akashdeep",
							className: "w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm border border-border focus:border-primary focus:outline-none",
							required: true
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "password",
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							id: "password",
							value: passwordInput,
							onChange: (e) => setPasswordInput(e.target.value),
							placeholder: "Enter administrator password",
							className: "w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm border border-border focus:border-primary focus:outline-none",
							required: true
						})]
					})] }),
					authError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive font-medium",
						children: authError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors",
						children: "Sign In"
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen pt-24 pb-16 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell max-w-6xl mx-auto space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-extrabold uppercase tracking-tight text-foreground",
						children: "UK 09 Management Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Administrator: Akashdeep • Live Data Panel"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-destructive border border-border hover:border-destructive px-4 py-2 rounded-sm transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Logout"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border p-5 rounded-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider",
										children: "Total Sales"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-emerald-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-2xl font-bold text-foreground mt-2",
									children: ["₹", totalRevenue]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: "Excludes cancelled orders"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border p-5 rounded-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider",
										children: "Total Orders"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4 text-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground mt-2",
									children: placedOrdersCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: [activeOrdersCount, " active delivery operations"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border p-5 rounded-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider",
										children: "Cancelled Orders"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 text-destructive" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground mt-2",
									children: cancelledOrdersCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: placedOrdersCount > 0 ? `${(cancelledOrdersCount / placedOrdersCount * 100).toFixed(0)}% cancellation rate` : "0% cancellation rate"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border p-5 rounded-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider",
										children: "Customer Reviews"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4 text-amber-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground mt-2",
									children: reviews.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: [avgReviewRating, "/5.0 average score"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-sm p-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold uppercase",
							children: "Customer Orders Log"
						})]
					}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-muted-foreground text-xs",
						children: "No orders have been submitted yet. When customers order, data will populate here in real-time."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-sm border border-border bg-background p-5 space-y-4 hover:border-primary/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-4 items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-display font-bold text-foreground",
													children: order.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: order.createdAt
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${order.status === "Cancelled" ? "bg-destructive/10 text-destructive border-destructive/20" : order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"}`,
													children: order.status
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold text-foreground mt-1",
											children: [
												order.name,
												" • ",
												order.phone
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: order.address
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Order Bill"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-display font-bold text-primary",
												children: ["₹", order.total]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												if (confirm(`Delete record for order ${order.id} from Admin panel?`)) deleteAdminOrder(order.id);
											},
											className: "p-2 border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-sm transition-colors",
											title: "Delete order record permanently",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-card border border-border/60 p-3 rounded-sm text-xs space-y-1",
									children: order.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
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
									}, idx))
								}),
								order.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2 items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2",
											children: "Set Status:"
										}), [
											"Received",
											"Preparing",
											"Out for Delivery",
											"Delivered"
										].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => updateOrderStatus(order.id, status),
											className: `px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors border ${order.status === status ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"}`,
											children: status
										}, status))]
									}), order.status !== "Delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 pt-1 border-t border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Admin Action:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleAdminCancelOrder(order.id, order.name),
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), "Cancel Order & Notify Customer"]
										})]
									})]
								})
							]
						}, order.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-12 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-7 bg-card border border-border rounded-sm p-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold uppercase",
									children: "Customer Reviews Log"
								})]
							}), reviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleResetReviews,
								className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Reset Database"]
							})]
						}), reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 text-center text-muted-foreground text-xs",
							children: "No user review records found. When customers write reviews, they will display here."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 max-h-[420px] overflow-y-auto pr-1 hide-scrollbar",
							children: reviews.map((rev, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border/50 pb-3 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-foreground",
												children: rev.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: rev.date
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-0.5 text-amber-500",
											children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: i < rev.rating ? "★" : "☆"
											}, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: rev.comment || rev.text || "(No comment written)"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDeleteReview(index),
									className: "p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-sm transition-colors align-self-center",
									title: "Delete review record",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}, index))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-5 bg-card border border-border rounded-sm p-6 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-bold uppercase",
									children: "Secret & System Settings"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold uppercase tracking-wider text-foreground",
										children: "Store Operation State"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Toggle to disable online checkouts."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm ${isStoreClosed ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`,
										children: isStoreClosed ? "Closed" : "Open"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleStoreStatus,
									className: `w-full flex items-center justify-center gap-2 min-h-11 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors border ${isStoreClosed ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 border-emerald-500/30 hover:text-white" : "bg-destructive/10 text-destructive hover:bg-destructive border-destructive/30 hover:text-white"}`,
									children: isStoreClosed ? "Open Store Operations" : "Close Store Operations"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-foreground",
									children: "Live Server Metas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Session Visitors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-foreground",
												children: simulatedVisitors
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DB Footprint (LocalStorage)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-foreground",
												children: [
													((JSON.stringify(orders) + JSON.stringify(reviews)).length / 1024).toFixed(2),
													" ",
													"KB"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Host IP Endpoint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] text-foreground",
												children: "127.0.0.1:8080"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-foreground",
									children: "Database Purging"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleResetOrders,
										className: "flex items-center justify-center gap-1.5 min-h-10 text-[10px] font-bold uppercase tracking-wider border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-sm transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear Orders"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleResetReviews,
										className: "flex items-center justify-center gap-1.5 min-h-10 text-[10px] font-bold uppercase tracking-wider border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-sm transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear Reviews"]
									})]
								})]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminPage as component };
