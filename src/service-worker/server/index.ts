/*
 * 虽然 ServiceWorker 对 Edge 版本要求比 CSS Grid 更高，但这是一项非必需的功能，即便没有 PWA 网页也能正常运行。
 */
import "./error-report";
import { initializeSettingManager } from "./settings";
import apiCacheRoute from "./api-cache";
import { CacheWrapper, cleanUnusedCache, useStaticCache } from "./cache";
import { RegexRoute, Router } from "./routing";
import { navigateRoute } from "./navigate";
import { cacheFirst } from "./fetch-strategy";

// 默认是 WebWorker，需要声明一下 ServiceWorker，其他文件里也一样。
declare const self: ServiceWorkerGlobalScope & {
	__WB_MANIFEST: string[];
};

/**
 * ServiceWorkerWebpackPlugin 自动生成，包含静态资源的列表
 */
const assets = self.__WB_MANIFEST;

initializeSettingManager();

/** 后端 API 有 Breaking Change 时增加版本号 */
const API_CACHE_NAME = "api-v2.0";

useStaticCache("static", assets);
const fetcher = cacheFirst(new CacheWrapper("static"));

const router = new Router();
router.addRoute(new RegexRoute("/static/", fetcher));
router.addRoute(apiCacheRoute(API_CACHE_NAME));

// Twitter 的代码里也是这样一个个写死的，且 app-shell 单独一个存储。
// https://abs.twimg.com/responsive-web/serviceworker/main.e531acd4.js 格式化后的第6200行
router.addRoute(navigateRoute({
	appShell: "/index.html",
	preload: true,
	includes: new RegExp("^/(?:$|list|login|article|edit|profile|about|console|error)"),
}));

self.addEventListener("fetch", router.route.bind(router));

/**
 * 安装事件，当新的 ServiceWorker 加载后将会调用，此时可能还有之前旧的在运行。
 *
 * 在这个事件里应当做一些没有副作用的初始化工作，比如初始化缓存机制等，但是不要做会影响
 * 其他ServiceWorker的事，比如清理旧缓存。
 *
 * 该事件只运行一次；有副作用的代码应当在 activate 事件里执行。
 */
self.addEventListener("install", () => {
	console.debug("[SW] Install new version");

	// 新版本安装后会等待旧版控制的页面全部关闭，以确保同时只有一个版本在运行，使用该语句将跳过等待。
	return self.skipWaiting();
});

/**
 * 激活事件，这个事件触发时表明当前 ServiceWorker 已经被使用。
 *
 * 在这个事件里应当清理旧版的缓存。
 */
self.addEventListener("activate", event => {
	console.info("[SW] New version activated");

	event.waitUntil(cleanUnusedCache());

	return self.clients.claim();
});
