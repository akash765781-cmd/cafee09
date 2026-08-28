import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { r as navLinks, t as business } from "./business-DZM1jd34.mjs";
import { C as Clock, p as Phone, s as ShoppingBag, t as X, v as Menu, y as MapPin } from "../_libs/lucide-react.mjs";
import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as useCart } from "./cart-Cx1mweoL.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ALYT7YM9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B98xe-kl.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function Wordmark({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `wordmark inline-flex items-baseline gap-[0.28em] leading-none ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UK" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-normal tracking-[0.18em] text-primary",
			children: "09"
		})]
	});
}
function Navbar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const overHero = pathname === "/";
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { itemCount } = useCart();
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || !overHero ? "border-b border-border bg-background/92 backdrop-blur-sm" : "bg-transparent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Primary",
			className: "shell flex h-16 items-center justify-between md:h-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-xl md:text-2xl",
					"aria-label": "UK 09 — home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "hidden items-center gap-8 md:flex",
					children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						activeOptions: { exact: link.to === "/" },
						activeProps: { className: "text-foreground after:scale-x-100" },
						className: "relative text-sm font-medium tracking-wide text-muted-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100",
						children: link.label
					}) }, link.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/order",
							className: "relative hidden items-center gap-2 bg-secondary text-foreground border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary md:inline-flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									"aria-hidden": "true",
									className: "size-3.5"
								}),
								"Order",
								itemCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground",
									children: itemCount
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: business.phoneHref,
							className: "hidden items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 lg:inline-flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								"aria-hidden": "true",
								className: "size-3.5"
							}), "Call"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen((v) => !v),
							"aria-expanded": open,
							"aria-controls": "mobile-nav",
							"aria-label": open ? "Close menu" : "Open menu",
							className: "inline-flex size-11 items-center justify-center border border-border text-foreground md:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								"aria-hidden": "true",
								className: "size-5"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								"aria-hidden": "true",
								className: "size-5"
							})
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "mobile-nav",
			className: "border-t border-border bg-background md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "shell flex flex-col py-2",
				children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: link.to,
					activeOptions: { exact: link.to === "/" },
					activeProps: { className: "text-primary" },
					className: "block border-b border-border py-4 font-display text-2xl font-extrabold tracking-tight",
					children: link.label
				}) }, link.to))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shell grid grid-cols-2 gap-3 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: business.phoneHref,
					className: "flex min-h-12 items-center justify-center bg-primary text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground",
					children: "Call"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: business.directionsHref,
					target: "_blank",
					rel: "noreferrer",
					className: "flex min-h-12 items-center justify-center border border-border text-xs font-semibold uppercase tracking-[0.16em]",
					children: "Directions"
				})]
			})]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-background pb-28 pt-16 md:pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid gap-12 md:grid-cols-[1.4fr_1fr_1.4fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-2xl",
					"aria-label": "UK 09 — home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 max-w-xs text-sm text-muted-foreground",
					children: [
						"Restaurant in ",
						business.city,
						", ",
						business.state,
						". Dine-in, every day ",
						business.hoursShort,
						"."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Footer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "eyebrow",
						children: "Navigate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2.5",
						children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: link.label
						}) }, link.to))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "eyebrow",
						children: "Visit & contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
						className: "mt-4 space-y-3 text-sm not-italic text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-sm",
								children: business.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: business.phoneHref,
								className: "text-foreground hover:text-primary",
								children: business.phoneDisplay
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.plusCode })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: business.directionsHref,
							target: "_blank",
							rel: "noreferrer",
							className: "border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary",
							children: "Get directions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: business.whatsappHref,
							target: "_blank",
							rel: "noreferrer",
							className: "border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary",
							children: "WhatsApp"
						})]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" UK 09, Bathinda."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Open daily ", business.hoursFull] })]
		})]
	});
}
function MobileActionBar() {
	const { itemCount } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur-sm md:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: business.phoneHref,
				className: "flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
					"aria-hidden": "true",
					className: "size-3.5"
				}), "Call"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/menu",
				className: "flex min-h-14 flex-col items-center justify-center gap-1 border-x border-border text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
					"aria-hidden": "true",
					className: "size-3.5"
				}), "Menu"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/order",
				className: "relative flex min-h-14 flex-col items-center justify-center gap-1 border-r border-border bg-primary text-[0.6rem] font-semibold uppercase tracking-wider text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
						"aria-hidden": "true",
						className: "size-3.5"
					}), itemCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-1.5 -right-2 flex size-3.5 items-center justify-center rounded-full bg-foreground text-[8px] font-bold text-background",
						children: itemCount
					})]
				}), "Order"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/my-orders",
				className: "flex min-h-14 flex-col items-center justify-center gap-1 border-r border-border text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
					"aria-hidden": "true",
					className: "size-3.5"
				}), "My Orders"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: business.directionsHref,
				target: "_blank",
				rel: "noreferrer",
				className: "flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
					"aria-hidden": "true",
					className: "size-3.5"
				}), "Map"]
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "UK 09 — Restaurant in Bathinda, Punjab" },
			{
				name: "description",
				content: "UK 09 is a dine-in restaurant on Green City Road, Bathinda. Open daily 10 AM–11 PM."
			},
			{
				name: "theme-color",
				content: "#231f1c"
			},
			{
				property: "og:site_name",
				content: "UK 09"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileActionBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-right",
				theme: "dark"
			})
		]
	});
}
var $$splitComponentImporter$7 = () => import("./routes-B8JGobgI.mjs");
var title$7 = "UK 09 — Restaurant in Bathinda, Punjab";
var description$7 = "UK 09 is a dine-in restaurant on Green City Road, Bathinda. Good food, a cozy atmosphere and friendly service, open daily 10 AM–11 PM.";
var jsonLd = {
	"@context": "https://schema.org",
	"@type": "Restaurant",
	name: "UK 09",
	telephone: "+917657815775",
	address: {
		"@type": "PostalAddress",
		streetAddress: "Green City Rd, inside Hotel Green In, opposite Park View Resorts, National Colony",
		addressLocality: "Bathinda",
		addressRegion: "Punjab",
		postalCode: "151001",
		addressCountry: "IN"
	},
	openingHoursSpecification: [{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday"
		],
		opens: "10:00",
		closes: "23:00"
	}],
	aggregateRating: {
		"@type": "AggregateRating",
		ratingValue: business.rating,
		reviewCount: business.reviewCount
	}
};
var Route$7 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: title$7 },
			{
				name: "description",
				content: description$7
			},
			{
				property: "og:title",
				content: title$7
			},
			{
				property: "og:description",
				content: description$7
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(jsonLd)
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./about-BIlRqK-b.mjs");
var title$6 = "About UK 09 — Dine-in Restaurant in Bathinda";
var description$6 = "UK 09 is a dine-in restaurant inside Hotel Green In on Green City Road, Bathinda — built around good food, a comfortable room and friendly service.";
var Route$6 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: title$6 },
		{
			name: "description",
			content: description$6
		},
		{
			property: "og:title",
			content: title$6
		},
		{
			property: "og:description",
			content: description$6
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin-CrP9kkpo.mjs");
var title$5 = "Admin Panel — UK 09 Restaurant, Bathinda";
var description$5 = "Secured dashboard for administrative management of UK 09.";
var Route$5 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: title$5 },
		{
			name: "description",
			content: description$5
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./location-B7T7drhh.mjs");
var title$4 = "Location & Hours — UK 09, Bathinda";
var description$4 = "Find UK 09 on Green City Rd, inside Hotel Green In, opposite Park View Resorts, National Colony, Bathinda 151001. Open daily 10 AM–11 PM.";
var Route$4 = createFileRoute("/location")({
	head: () => ({ meta: [
		{ title: title$4 },
		{
			name: "description",
			content: description$4
		},
		{
			property: "og:title",
			content: title$4
		},
		{
			property: "og:description",
			content: description$4
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./menu-BZqHsPi4.mjs");
var title$3 = "Menu — UK 09 Restaurant, Bathinda";
var description$3 = "Browse the menu at UK 09, a dine-in restaurant in Bathinda, Punjab. Categories and prices are published directly from the restaurant's own menu.";
var Route$3 = createFileRoute("/menu")({
	head: () => ({ meta: [
		{ title: title$3 },
		{
			name: "description",
			content: description$3
		},
		{
			property: "og:title",
			content: title$3
		},
		{
			property: "og:description",
			content: description$3
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./my-orders-DcqPYrB_.mjs");
var title$2 = "My Orders — UK 09 Restaurant, Bathinda";
var description$2 = "View and track all your previous and active orders placed at UK 09 Restaurant, Bathinda.";
var Route$2 = createFileRoute("/my-orders")({
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./order-D4yLjWk3.mjs");
var title$1 = "Order Online — UK 09 Restaurant, Bathinda";
var description$1 = "Place and track your order online at UK 09. Fresh food delivered hot to your door in Bathinda.";
var Route$1 = createFileRoute("/order")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./reviews-DviUccXQ.mjs");
var title = "Reviews — UK 09 Restaurant, Bathinda";
var description = `UK 09 holds a ${business.rating} star rating from ${business.reviewCount} Google reviews, with diners in Bathinda highlighting the food, atmosphere and service.`;
var Route = createFileRoute("/reviews")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AboutRoute: Route$6.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$8
	}),
	AdminRoute: Route$5.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$8
	}),
	LocationRoute: Route$4.update({
		id: "/location",
		path: "/location",
		getParentRoute: () => Route$8
	}),
	MenuRoute: Route$3.update({
		id: "/menu",
		path: "/menu",
		getParentRoute: () => Route$8
	}),
	MyOrdersRoute: Route$2.update({
		id: "/my-orders",
		path: "/my-orders",
		getParentRoute: () => Route$8
	}),
	OrderRoute: Route$1.update({
		id: "/order",
		path: "/order",
		getParentRoute: () => Route$8
	}),
	ReviewsRoute: Route.update({
		id: "/reviews",
		path: "/reviews",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
