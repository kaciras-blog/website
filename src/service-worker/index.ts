declare const self: ServiceWorkerGlobalScope;

import { cacheNames, CacheProxyServer, ManagedCache, RegexRoute } from "./cache";

// ServiceWorkerWebpackPlugin 自动生成此字段，其中包含静态资源列表 .
declare var serviceWorkerOption: {
	assets: string[];
};

// self.addEventListener("error", function (e) {
// 	self.clients.matchAll().then(clients => {
// 		if (clients && clients.length) {
// 			clients[0].postMessage({
// 				type: "ERROR",
// 				msg: e.message || null,
// 				stack: e.error ? e.error.stack : null,
// 			});
// 		}
// 	});
// });
//
// self.addEventListener("unhandledrejection", function (e) {
// 	self.clients.matchAll().then(clients => {
// 		if (clients && clients.length) {
// 			clients[0].postMessage({
// 				type: "REJECTION",
// 				msg: e.reason ? e.reason.message : null,
// 				stack: e.reason ? e.reason.stack : null,
// 			});
// 		}
// 	});
// });

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
								主要逻辑部分
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const STATIC_CACHE_NAME = "StaticFiles";
const proxyServer = new CacheProxyServer();
proxyServer.addFetchListener();


async function initUserCode() {
	const staticCache = await ManagedCache.create(STATIC_CACHE_NAME); // add STATIC_CACHE_NAME to cacheNames

	proxyServer.addRoute(new RegexRoute("/static/", staticCache.cacheFirst()));
	proxyServer.addRoute(new RegexRoute("/$", staticCache.networkFirst()));

	const shell = await fetch("/?shellOnly=true");
	await staticCache.put("/", shell);

	// const ApiCache = new ManagedCache("API", 256, 7 * 24 * 60 * 60);
	// proxyServer.addRoute(new RegexRoute("//api.kaciras.net/", ApiCache.staleWhileRevalidate()));
}

self.addEventListener("install", (event: ExtendableEvent) => {
	const { assets } = serviceWorkerOption;

	event.waitUntil(caches.open(STATIC_CACHE_NAME)
		.then(cache => cache.addAll(assets))
		.then(() => console.log("Precache successfully."))
		.catch(err => console.error("Precache failure.", err))
	);

	event.waitUntil(initUserCode());
	return self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
	console.log("[ServiceWorker]: Activate!");

	// 删除当前版本用不到的缓存，并启用导航预载
	const init = async () => {
		const keys = (await caches.keys()).filter(k => !cacheNames.has(k));
		await Promise.all(keys.map(k => caches.delete(k)));

		if (self.registration.navigationPreload) {
			await self.registration.navigationPreload.enable();
		}
	};

	event.waitUntil(init());
	return self.clients.claim();
});
