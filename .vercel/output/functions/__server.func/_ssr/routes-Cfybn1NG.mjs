import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as business } from "./business-DZM1jd34.mjs";
import { O as ArrowRight, y as MapPin } from "../_libs/lucide-react.mjs";
import { t as CTASection } from "./CTASection-Pmk0H9N2.mjs";
import { n as FoodFeature, r as Gallery, t as AboutSection } from "./FoodFeature-D4DV7KtO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LocationSection, t as InfoStrip } from "./LocationSection-DDakPgkV.mjs";
import { t as MenuSection } from "./MenuSection-BYiERnkI.mjs";
import { t as ReviewsSection } from "./ReviewsSection-CA5gkmLl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cfybn1NG.js
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-Bsk-G7Gn.jpg";
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grain relative flex min-h-[92svh] items-end overflow-hidden pb-14 pt-32 md:min-h-screen md:pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero_default,
				alt: "Warmly lit restaurant dining room with set tables and amber pendant lighting",
				width: 1920,
				height: 1280,
				fetchPriority: "high",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shell relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [business.city, " • Dining & Food"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 max-w-4xl text-[clamp(2.75rem,9vw,7rem)] uppercase",
						children: [
							"Good Food.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Great Vibe.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "UK 09."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
						children: "A welcoming dine-in destination in Bathinda for flavorful food, relaxed moments and time well spent with friends and family."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-9 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/menu",
							className: "group inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90",
							children: ["View menu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								"aria-hidden": "true",
								className: "size-4 transition-transform group-hover:translate-x-1"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: business.directionsHref,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex min-h-13 items-center justify-center gap-2 border border-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								"aria-hidden": "true",
								className: "size-4"
							}), "Get directions"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: ["Open daily • ", business.hoursShort]
					})
				]
			})
		]
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoStrip, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSection, { heading: "Featured Menu" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodFeature, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})
	] });
}
//#endregion
export { Index as component };
