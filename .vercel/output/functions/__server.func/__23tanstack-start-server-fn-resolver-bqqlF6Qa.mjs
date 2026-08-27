//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-bqqlF6Qa.js
var manifest = {
	"644a36e83d83c30fe0e25987e87a9ef663178bd53530e1d9a8e9aadb65ff451e": {
		functionName: "clearAllOrdersServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"a8ed28cb0e6f0a6718cecdbb7112403f4e2fb340b3dc121421198f4faca621f9": {
		functionName: "getReviewsServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"b58704261c5442f76f2b63305982126957863a9e187c0f9bc8cca8ee92ecf0db": {
		functionName: "setReviewsServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"b881f78328db9a99ef7f3f46228f80459be5966146283324751b7dd97bcb89b5": {
		functionName: "getOrdersServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"b8bd569b48eb39bf1bda24fd0f31ccf29b3cfd06a17e0694c6605a3e8e827e8c": {
		functionName: "getStoreClosedServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"ca01e43fc423852eeb520611f252838c66f748acad7a279e4c685d20177299f3": {
		functionName: "setOrdersServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	},
	"eb5c2a36344db6109f61d603ec55f05c119a17b6ef40450c147da44738dfc9e9": {
		functionName: "setStoreClosedServer_createServerFn_handler",
		importer: () => import("./_ssr/db-D5iIwE3t.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
