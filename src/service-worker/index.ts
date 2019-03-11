import { cacheNames, ManagedCache } from "./cache";
import { CacheProxyServer, RegexRoute } from "./cache-server";

// 默认是WebWorker，需要声明一下ServiceWorker，其他文件里也一样。
declare const self: ServiceWorkerGlobalScope;

// ServiceWorkerWebpackPlugin 自动生成，其中包含静态资源列表 .
declare const serviceWorkerOption: {
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
proxyServer.registerFetchListener();


async function initUserCode() {
	const staticCache = await ManagedCache.create(STATIC_CACHE_NAME);

	proxyServer.addRoute(new RegexRoute("/static/", staticCache.cacheFirst()));
	proxyServer.addRoute(new RegexRoute("/$", staticCache.networkFirst()));

	const shell = await fetch("/?shellOnly=true");
	await staticCache.put("/", shell);

	// const ApiCache = new ManagedCache("API", 256, 7 * 24 * 60 * 60);
	// proxyServer.addRoute(new RegexRoute("//api.kaciras.net/", ApiCache.staleWhileRevalidate()));
}

/**
 * 安装事件，当新的 ServiceWorker 加载后将会调用，此时可能还有之前旧的ServiceWorker在运行。
 *
 * 在这个事件里应当做一些没有副作用的初始化工作，比如初始化缓存机制等，但是不要做会影响
 * 其他ServiceWorker的事，比如清理旧缓存。
 *
 * 有副作用的代码应当在 activate 事件里执行。
 */
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

/**
 * 激活事件，这个事件触发时表明当前ServiceWorker已经被使用。
 *
 * 在这个事件里应当清理旧版的缓存。
 */
self.addEventListener("activate", (event: ExtendableEvent) => {
	console.log("[ServiceWorker]: Activate!");

	// 删除当前版本用不到的缓存，并启用导航预载
	const init = async () => {
		const keys = (await caches.keys()).filter(k => !cacheNames.has(k));
		await Promise.all(keys.map(k => caches.delete(k)));
	};

	if (self.registration.navigationPreload) {
		event.waitUntil(self.registration.navigationPreload.enable());
	}

	event.waitUntil(init());
	return self.clients.claim();
});
