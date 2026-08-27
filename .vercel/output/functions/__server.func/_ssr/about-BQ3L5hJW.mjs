import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageHeader } from "./PageHeader-DUEAwHLy.mjs";
import { t as CTASection } from "./CTASection-gpAVbZFC.mjs";
import { n as FoodFeature, r as Gallery, t as AboutSection } from "./FoodFeature-BYJW4EPi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BQ3L5hJW.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "About",
			title: "A Place to Eat, Relax & Stay Awhile",
			intro: "A dine-in restaurant in Bathinda, open every day from 10 AM to 11 PM."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodFeature, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})
	] });
}
//#endregion
export { AboutPage as component };
