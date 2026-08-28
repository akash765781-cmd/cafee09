import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageHeader } from "./PageHeader-DUEAwHLy.mjs";
import { t as business } from "./business-DRQahRvE.mjs";
import { t as CTASection } from "./CTASection-7wg4MTK-.mjs";
import { t as ReviewsSection } from "./ReviewsSection-6YD3VsgV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-BDSImo8Z.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Reviews",
			title: "Loved by Diners in Bathinda",
			intro: `${business.rating} ★ from ${business.reviewCount} Google reviews.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})
	] });
}
//#endregion
export { ReviewsPage as component };
