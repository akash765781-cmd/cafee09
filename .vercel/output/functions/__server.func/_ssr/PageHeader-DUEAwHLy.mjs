import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHeader-DUEAwHLy.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ eyebrow, title, intro }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border pb-14 pt-32 md:pb-20 md:pt-44",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 max-w-4xl text-[clamp(2.5rem,8vw,6rem)] uppercase",
					children: title
				}),
				intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
					children: intro
				})
			]
		})
	});
}
//#endregion
export { PageHeader as t };
