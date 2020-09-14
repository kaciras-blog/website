/*
 * 虽然 ServiceWorker 对 Edge 版本要求比 CSS Grid 更高，但这是一项非必需的功能，即便没有 PWA 网页也能正常运行。
 */
import "./error-report";
import { initializeSettingManager } from "./settings";
import apiCacheRoute from "./api-cache";
import { CacheWrapper, cleanUnusedCache } from "./cache";
import { NavigateRoute, RegexRoute, Router } from "./routing";
import { cacheFirst } from "./fetch-strategy";

// 默认是 WebWorker，需要声明一下ServiceWorker，其他文件里也一样。
declare const self: ServiceWorkerGlobalScope;

/**
 * ServiceWorkerWebpackPlugin 自动生成，包含静态资源的列表
 */
declare const serviceWorkerOption: {
	assets: string[];
};

initializeSettingManager();

/** 代码和依赖有较大改动时增加版本号 */
const STATIC_CACHE_NAME = "static-v1.5";

/** 后端 API 有 Breaking Change 时增加版本号 */
const API_CACHE_NAME = "api-v1.2";

const cache = new CacheWrapper(STATIC_CACHE_NAME);
const router = new Router();
const fetcher = cacheFirst(cache);

router.addRoute(new RegexRoute("/static/", fetcher));

router.addRoute(apiCacheRoute(API_CACHE_NAME));

// Twitter 的代码里也是这样一个个写死的
// https://abs.twimg.com/responsive-web/serviceworker/main.e531acd4.js 格式化后的第6200行
const APP_SHELL_RE = new RegExp("^/(?:$|list|login|article|edit|profile|about|console|error)")
const APP_SHELL_NAME = "/app-shell.html";
router.addRoute(new NavigateRoute(cache, APP_SHELL_NAME, APP_SHELL_RE));

self.addEventListener("fetch", router.route.bind(router));

/**
 * 安装事件，当新的 ServiceWorker 加载后将会调用，此时可能还有之前旧的ServiceWorker在运行。
 *
 * 在这个事件里应当做一些没有副作用的初始化工作，比如初始化缓存机制等，但是不要做会影响
 * 其他ServiceWorker的事，比如清理旧缓存。
 *
 * 该事件只运行一次；有副作用的代码应当在 activate 事件里执行。
 */
self.addEventListener("install", event => {
	console.debug("[SW] Install new version");

	event.waitUntil(fetch(APP_SHELL_NAME)
		.then(appShell => cache.put(APP_SHELL_NAME, appShell)));

	event.waitUntil(caches.open(STATIC_CACHE_NAME)
		.then(cache => cache.addAll(serviceWorkerOption.assets))
		.catch(err => console.error("静态资源预加载失败", err)));

	// 新版本安装后会等待旧版控制的页面全部关闭，以确保同时只有一个版本在运行，使用该语句将跳过等待。
	return self.skipWaiting();
});

/**
 * 激活事件，这个事件触发时表明当前ServiceWorker已经被使用。
 *
 * 在这个事件里应当清理旧版的缓存。
 */
self.addEventListener("activate", event => {
	console.info("[SW] New version activated");

	/*
	 * 浏览器会停止没有相关页面打开的 ServiceWorker 以节约资源，如果监听了 fetch 事件，
	 * 那么任何请求都必须等到 ServiceWorker 启动完成后才能发送，保证其能够被拦截。
	 *
	 * 通过打开导航预载，可以允许 ServiceWorker 未启动时就发送导航请求，与其启动过程并行执行，
	 * 待 ServiceWorker 启动完成后再激活拦截事件，使用 FetchEvent.preloadResponse 获取预载的响应。
	 *
	 * 如果使用了 AppShell 模式，则不需要每次都从网络读取页面，可以不开启该功能。
	 *
	 * 如果之前开启过，以后不再使用时必须调用 navigationPreload.disable() 关闭。
	 *
	 * 详情见：https://developers.google.com/web/updates/2017/02/navigation-preload
	 */
	if (self.registration.navigationPreload) {
		event.waitUntil(self.registration.navigationPreload.enable());
	}

	event.waitUntil(cleanUnusedCache());

	return self.clients.claim();
});
