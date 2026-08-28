import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as menuCategories } from "./business-DZM1jd34.mjs";
import { O as ArrowRight, f as Plus } from "../_libs/lucide-react.mjs";
import { n as Reveal } from "./CTASection-Pmk0H9N2.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useCart } from "./cart-C9zTcxRu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MenuSection-BYiERnkI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var parsePrice = (priceStr) => parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
function MenuSection({ heading = "The Menu", intro = "The full menu is being digitised from the restaurant's own card. Item names, descriptions and prices appear here exactly as they are on it — nothing is filled in until then.", showCta = true }) {
	const [active, setActive] = (0, import_react.useState)(menuCategories[0].id);
	const current = menuCategories.find((c) => c.id === active) ?? menuCategories[0];
	const { addItem } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "menu",
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Food"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase",
						children: heading
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-sm leading-relaxed text-muted-foreground",
						children: intro
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 -mx-5 overflow-x-auto px-5 hide-scrollbar md:mx-0 md:px-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "tablist",
						"aria-label": "Menu categories",
						className: "flex min-w-max gap-8 border-b border-border",
						children: menuCategories.map((cat) => {
							const isActive = cat.id === active;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								role: "tab",
								type: "button",
								id: `tab-${cat.id}`,
								"aria-selected": isActive,
								"aria-controls": `panel-${cat.id}`,
								onClick: () => setActive(cat.id),
								className: `relative -mb-px min-h-11 pb-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
								children: [cat.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: `absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform ${isActive ? "scale-x-100" : "scale-x-0"}`
								})]
							}, cat.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tabpanel",
					id: `panel-${current.id}`,
					"aria-labelledby": `tab-${current.id}`,
					className: "mt-10 grid gap-x-14 gap-y-8 md:grid-cols-2",
					children: current.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border-b border-border pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-bold uppercase tracking-tight",
									children: item.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: "h-px flex-1 translate-y-[-2px] bg-border"
								}),
								item.price.includes("/") && (item.price.includes("H:") || item.price.includes("Half")) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2 text-xs font-semibold",
									children: item.price.split("/").map((part, index) => {
										const isHalf = part.toLowerCase().includes("h");
										const cleanPriceStr = part.replace(/[hf]:/gi, "").trim();
										const priceNum = parsePrice(cleanPriceStr);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												addItem({
													id: `${item.name}-${isHalf ? "Half" : "Full"}`,
													name: item.name,
													price: priceNum,
													portion: isHalf ? "Half" : "Full"
												});
												toast.success(`Added ${isHalf ? "Half" : "Full"} ${item.name} to cart`);
											},
											className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-secondary hover:bg-secondary/80 text-foreground text-[10px] tracking-wider uppercase border border-border/50 transition-colors group cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground group-hover:text-foreground transition-colors",
													children: isHalf ? "Half" : "Full"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary font-bold group-hover:text-primary transition-colors",
													children: cleanPriceStr
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-muted-foreground group-hover:text-primary transition-colors" })
											]
										}, index);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-bold text-primary",
										children: item.price
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											addItem({
												id: item.name,
												name: item.name,
												price: parsePrice(item.price)
											});
											toast.success(`Added ${item.name} to cart`);
										},
										className: "inline-flex items-center justify-center size-7 rounded-sm bg-secondary hover:bg-secondary/80 border border-border/50 text-foreground transition-colors group cursor-pointer",
										"aria-label": `Add ${item.name} to cart`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 text-muted-foreground group-hover:text-primary transition-colors" })
									})]
								})
							]
						}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: item.description
						})]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground",
					children: "Prices are in INR. Portion availability (Half / Full) as indicated."
				}),
				showCta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/menu",
						className: "group inline-flex min-h-13 items-center gap-2 border border-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-primary hover:text-primary",
						children: ["Explore full menu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							"aria-hidden": "true",
							className: "size-4 transition-transform group-hover:translate-x-1"
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { MenuSection as t };
