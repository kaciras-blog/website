/*
 * 虽然 ServiceWorker 对 Edge 版本要求比 CSS Grid 更高，但这是一项非必需的功能，即便没有 PWA 网页也能正常运行。
 */
import { cacheNames, ManagedCache } from "./cache";
import { CacheProxyServer, AppShellRoute, RegexRoute } from "./router";
import { CacheFirstHandler } from "./cache-strategy";

// 默认是WebWorker，需要声明一下ServiceWorker，其他文件里也一样。
declare const self: ServiceWorkerGlobalScope;

// ServiceWorkerWebpackPlugin 自动生成，其中包含静态资源列表 .
declare const serviceWorkerOption: {
	assets: string[];
};

const STATIC_CACHE_NAME = "Static";
const proxyServer = new CacheProxyServer();


async function initUserCode() {
	const cache = await ManagedCache.create(STATIC_CACHE_NAME);
	proxyServer.addRoute(new AppShellRoute(cache, "/app-shell.html"));
	proxyServer.addRoute(new RegexRoute("/static/", new CacheFirstHandler(cache)));
}

self.addEventListener('fetch', proxyServer.handleFetchEvent.bind(proxyServer));

/**
 * 安装事件，当新的 ServiceWorker 加载后将会调用，此时可能还有之前旧的ServiceWorker在运行。
 *
 * 在这个事件里应当做一些没有副作用的初始化工作，比如初始化缓存机制等，但是不要做会影响
 * 其他ServiceWorker的事，比如清理旧缓存。
 *
 * 有副作用的代码应当在 activate 事件里执行。
 */
self.addEventListener("install", (event: ExtendableEvent) => {
	event.waitUntil(initUserCode());

	event.waitUntil(caches.open(STATIC_CACHE_NAME)
		.then(cache => cache.addAll(serviceWorkerOption.assets))
		.catch(err => console.error("静态资源预加载失败", err))
	);
	return self.skipWaiting();
});


/**
 * 激活事件，这个事件触发时表明当前ServiceWorker已经被使用。
 *
 * 在这个事件里应当清理旧版的缓存。
 */
self.addEventListener("activate", (event: ExtendableEvent) => {
	// console.log("[ServiceWorker]: Activate!");

	/*
	 * 浏览器会停止没有相关页面打开的ServiceWorker以节约资源，那么对于导航请求来说可能此时ServiceWorker还没有
	 * 从停止状态重新启动。如果ServiceWorker里有拦截请求的配置，那么导航请求必须等到ServiceWorker启动完成后才
	 * 能发送以便其能够被拦截，这会导致导航请求多等待ServiceWorker启动的时间。
	 *
	 * 通过打开导航预载，可以允许ServiceWorker未启动时就发送导航请求，与其启动过程并行执行，待ServiceWorker启动
	 * 完成后再激活拦截事件，并行加载的导航请求使用 FetchEvent.preloadResponse 获取。
	 *
	 * 如果使用了 AppShell 模式，则不需要每次都从网络读取页面，不应开启该功能。
	 */
	// if (self.registration.navigationPreload) {
	// 	event.waitUntil(self.registration.navigationPreload.enable());
	// }

	// 删除当前版本用不到的缓存
	event.waitUntil(async () => {
		const keys = (await caches.keys()).filter(k => !cacheNames.has(k));
		await Promise.all(keys.map(k => caches.delete(k)));
	});

	return self.clients.claim();
});
