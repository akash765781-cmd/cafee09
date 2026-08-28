import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as weekdays, t as business } from "./business-DRQahRvE.mjs";
import { p as Phone, y as MapPin } from "../_libs/lucide-react.mjs";
import { n as Reveal } from "./CTASection-7wg4MTK-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LocationSection-DW9WfOul.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cells = [
	{
		label: "Open daily",
		value: business.hoursShort
	},
	{
		label: "Dine-in",
		value: "Available"
	},
	{
		label: "Location",
		value: `${business.city}, ${business.state}`
	},
	{
		label: "Call",
		value: business.phoneDisplay,
		href: business.phoneHref
	}
];
function InfoStrip() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-label": "Essential information",
		className: "border-y border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "shell grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x",
			children: cells.map((cell, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `px-1 py-6 md:px-8 md:py-8 ${i % 2 === 0 ? "" : "border-l border-border md:border-l-0"} ${i < 2 ? "border-b border-border md:border-b-0" : ""} ${i % 2 === 1 ? "pl-5" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: cell.label
				}), cell.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: cell.href,
					className: "mt-2 block font-display text-lg font-bold tracking-tight transition-colors hover:text-primary md:text-xl",
					children: cell.value
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-lg font-bold tracking-tight md:text-xl",
					children: cell.value
				})]
			}, cell.label))
		})
	});
}
function getBathindaNow() {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Kolkata",
		weekday: "long",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(/* @__PURE__ */ new Date());
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
	return {
		weekday: get("weekday"),
		minutes: Number(get("hour")) * 60 + Number(get("minute"))
	};
}
function HoursCard() {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(getBathindaNow());
		const id = setInterval(() => setNow(getBathindaNow()), 6e4);
		return () => clearInterval(id);
	}, []);
	const open = now ? now.minutes >= 600 && now.minutes < 1380 : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-card p-7 md:p-9",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-bold uppercase tracking-tight",
					children: "Opening hours"
				}), open !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-2 border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${open ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${open ? "bg-primary" : "bg-muted-foreground"}` }), open ? "Open now" : "Closed now"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 divide-y divide-border",
				children: weekdays.map((day) => {
					const isToday = now?.weekday === day;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between py-3 text-sm ${isToday ? "text-foreground" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: isToday ? "font-semibold" : "",
							children: day
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: isToday ? "font-semibold" : "",
							children: business.hoursFull
						})]
					}, day);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs text-muted-foreground",
				children: "Times shown for Bathinda (IST)."
			})
		]
	});
}
function LocationSection({ withHours = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "location",
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Find us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase",
					children: [
						"Green City Road,",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Bathinda"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-6 md:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "md:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full border border-border bg-card p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: "Map showing UK 09 on Green City Road, Bathinda",
							src: business.mapEmbedSrc,
							loading: "lazy",
							referrerPolicy: "no-referrer-when-downgrade",
							className: "h-80 w-full grayscale-[0.35] contrast-[1.05] md:h-full md:min-h-[26rem]"
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 md:col-span-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 60,
						className: "border border-border bg-card p-7 md:p-9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-bold uppercase tracking-tight",
								children: "UK 09"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
								className: "mt-4 space-y-3 text-sm not-italic leading-relaxed text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.address }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.16em]",
									children: business.plusCode
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: business.directionsHref,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										"aria-hidden": "true",
										className: "size-4"
									}), "Get directions"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: business.phoneHref,
									className: "inline-flex min-h-13 items-center justify-center gap-2 border border-foreground/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
											"aria-hidden": "true",
											className: "size-4"
										}),
										"Call ",
										business.phoneDisplay
									]
								})]
							})
						]
					}), withHours && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 120,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoursCard, {})
					})]
				})]
			})]
		})
	});
}
//#endregion
export { LocationSection as n, InfoStrip as t };
