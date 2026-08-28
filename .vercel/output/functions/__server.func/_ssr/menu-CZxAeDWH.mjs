import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageHeader } from "./PageHeader-DUEAwHLy.mjs";
import { t as CTASection } from "./CTASection-7wg4MTK-.mjs";
import { t as MenuSection } from "./MenuSection-B5L4apo8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-CZxAeDWH.js
var import_jsx_runtime = require_jsx_runtime();
function MenuPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Bathinda • Dine-in",
			title: "The Menu",
			intro: "Browse our selection of authentic Punjabi dishes, starters, and beverages, published directly from our official menu card."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSection, {
			heading: "By Category",
			showCta: false,
			intro: "Pick a category to see our dishes. Every item and price is published directly from our printed menu."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})
	] });
}
//#endregion
export { MenuPage as component };
