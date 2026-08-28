import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as business } from "./business-DRQahRvE.mjs";
import { _ as MessageCircle, p as Phone, y as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CTASection-7wg4MTK-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting) {
				setVisible(true);
				observer.disconnect();
			}
		}, {
			rootMargin: "0px 0px -10% 0px",
			threshold: .05
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		"data-visible": visible,
		style: { transitionDelay: `${delay}ms` },
		className: `reveal ${className}`,
		children
	});
}
function CTASection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-cream py-20 text-cream-foreground md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-cream-foreground/60",
					children: "Visit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-4xl text-[clamp(2.25rem,7vw,5.5rem)] uppercase",
					children: "Your Table. Your People. Your Evening."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-lg text-base leading-relaxed text-cream-foreground/75 md:text-lg",
					children: "Drop by UK 09 in Bathinda and make your next meal part of the evening."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: business.directionsHref,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								"aria-hidden": "true",
								className: "size-4"
							}), "Get directions"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: business.phoneHref,
							className: "inline-flex min-h-13 items-center justify-center gap-2 border border-cream-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-cream-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									"aria-hidden": "true",
									className: "size-4"
								}),
								"Call ",
								business.phoneDisplay
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: business.whatsappHref,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex min-h-13 items-center justify-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-cream-foreground/70 transition-colors hover:text-cream-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
								"aria-hidden": "true",
								className: "size-4"
							}), "WhatsApp us"]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Reveal as n, CTASection as t };
