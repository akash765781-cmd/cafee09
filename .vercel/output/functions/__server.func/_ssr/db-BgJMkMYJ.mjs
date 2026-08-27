import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-WXVUdhxi.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-BgJMkMYJ.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getOrdersServer = createServerFn({ method: "GET" }).handler(createSsrRpc("b881f78328db9a99ef7f3f46228f80459be5966146283324751b7dd97bcb89b5"));
var setOrdersServer = createServerFn({ method: "POST" }).handler(createSsrRpc("ca01e43fc423852eeb520611f252838c66f748acad7a279e4c685d20177299f3"));
var getReviewsServer = createServerFn({ method: "GET" }).handler(createSsrRpc("a8ed28cb0e6f0a6718cecdbb7112403f4e2fb340b3dc121421198f4faca621f9"));
var setReviewsServer = createServerFn({ method: "POST" }).handler(createSsrRpc("b58704261c5442f76f2b63305982126957863a9e187c0f9bc8cca8ee92ecf0db"));
var getStoreClosedServer = createServerFn({ method: "GET" }).handler(createSsrRpc("b8bd569b48eb39bf1bda24fd0f31ccf29b3cfd06a17e0694c6605a3e8e827e8c"));
var setStoreClosedServer = createServerFn({ method: "POST" }).handler(createSsrRpc("eb5c2a36344db6109f61d603ec55f05c119a17b6ef40450c147da44738dfc9e9"));
//#endregion
export { setReviewsServer as a, setOrdersServer as i, getReviewsServer as n, setStoreClosedServer as o, getStoreClosedServer as r, getOrdersServer as t };
