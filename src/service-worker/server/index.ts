import { RPC } from "@kaciras/utilities/browser";
import "./error-report.ts";
import * as settings from "./settings.ts";
import apiCacheRoute from "./api-cache.ts";
import { CacheWrapper, cleanUnusedCache, useStaticCache } from "./cache.ts";
import { RegexRoute, Router } from "./routing.ts";
import { navigateRoute } from "./navigate.ts";
import { cacheFirst } from "./fetch-strategy.ts";

// 默认是 WebWorker，需要声明一下 ServiceWorker，其他文件里也一样。
declare const self: ServiceWorkerGlobalScope & {
	__WB_MANIFEST: string[];
};

/**
 * 由构建插件自动生成，包含静态资源的列表。
 */
const assets = self.__WB_MANIFEST;

/**
 * 后端 API 有 Breaking Change 时增加版本号。
 */
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
 * 在这个事件里应当做一些没有副作用的初始化工作，比如初始化缓存等，
 * 不要做会影响其它 ServiceWorker 的事，比如清理旧缓存。
 *
 * 该事件只运行一次；有副作用的代码应当在 activate 事件里执行。
 */
self.addEventListener("install", () => {
	console.debug("[SW] Install new version");

	// 新安装后会等待旧版控制的页面全部关闭，以确保同时只有一个版本在运行，使用该语句将跳过等待。
	return self.skipWaiting();
});

/**
 * 激活事件，这个事件触发时表明当前 ServiceWorker 已经被使用。
 *
 * 在这个事件里可以清理旧版的缓存。
 */
self.addEventListener("activate", event => {
	console.info("[SW] New version activated");

	event.waitUntil(cleanUnusedCache());

	// 接管所有前端页面，即使它们目前并不由该版本的 SW 控制。
	return self.clients.claim();
});

const functions = {
	getOptions: settings.getAll,
	setOption: settings.set,
};

export type SWServerAPI = typeof functions;

self.addEventListener("message", async event => {
	event.source!.postMessage(...await RPC.serve(functions, event.data));
});
