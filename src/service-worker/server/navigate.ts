import { CacheWrapper, ManagedCache } from "./cache";
import { Route } from "./routing";
import { FetchFn, staleWhileRevalidate } from "./fetch-strategy";

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

/**
 * 处理导航请求的路由，根据情况返回网络请求或缓存的 AppShell。
 * 记得打开 navigationPreload 功能。
 */
class NavigateRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly path: string;
	private readonly include: RegExp;

	/**
	 * 新建导航路由，将使用指定路径的页面作为应用的外壳，并将其缓存。
	 *
	 * @param cache 缓存
	 * @param path 应用外壳的URI路径
	 * @param include 包含的路径，没有表示全部都拦截
	 */
	constructor(cache: ManagedCache, path: string, include?: RegExp) {
		this.path = path;
		this.fetch = staleWhileRevalidate(cache);
		this.include = include || new RegExp("");
	}

	match(request: Request) {
		if (request.mode !== "navigate") {
			return false;
		}
		const url = new URL(request.url);
		return this.include.test(url.pathname);
	}

	handle(event: FetchEvent) {
		event.respondWith(this.selectDocument(event));
	}

	/**
	 * 选择最佳的 HTML 文件作为响应，如果支持导航预载则返回预载的请求，否则使用 AppShell。
	 * 优先使用网络请求保证资源是最新的，不支持预载或预载失败的使用 AppShell 确保尽快响应。
	 *
	 * 【AppShell的缓存问题】
	 * Request 默认缓存是不去服务端检查的，而AppShell文件名不带Hash，必须禁用缓存防止无法更新
	 * https://developer.mozilla.org/zh-CN/docs/Web/API/Request/cache
	 *
	 * 【关于竞速】
	 * 我曾设想让缓存读取 AppShell 与网络请求来竞速，以提升某些情况下的加载时间，
	 * 并减少用户看到旧版页面的次数，但这个尝试失败了，因为：
	 *
	 * 1）后端 SSR 返回的页面包含了数据，而 AppShell 没有，两者不对等。
	 * 2）NavigationPreload 的兼容性还不行，在不支持的浏览器上发网络请求要等 SW 启动太慢。
	 *
	 * @private
	 * @param event 请求事件
	 */
	private async selectDocument(event: FetchEvent) {
		try {
			const preload = await event.preloadResponse;
			if (preload) {
				return preload;
			}
		} catch (e) {
			console.warn("[SW] 导航预载失败，使用 AppShell");
		}
		return this.fetch(new Request(this.path, { cache: "no-cache" }));
	}
}

export interface NavigateOptions {

	/**
	 * 页面模板的 URL，通常就是 index.html。
	 */
	appShell: string;

	/**
	 * 哪些路径是页面请求，该路由仅对它们使用。
	 * 导航请求不一定是页面，比如在新标签页查看图片。
	 */
	includes: RegExp;

	/**
	 * 是否启用导航预载，可以是以下值：
	 * false	 - 禁用；
	 * true		 - 启用；
	 * undefined - 保持上次的不变；
	 */
	preload?: boolean;
}

export function navigateRoute(options: NavigateOptions) {
	const { appShell, includes, preload } = options;

	// event.waitUntil(fetch(appShell)
	// 	.then(response => cache.put(appShell, response)));

	self.addEventListener("activate", event => {
		const { navigationPreload } = self.registration;
		if (preload === undefined || !navigationPreload) {
			return;
		}
		if (preload) {
			event.waitUntil(navigationPreload.enable());
		} else {
			event.waitUntil(navigationPreload.disable());
		}
	});

	const cache = new CacheWrapper("app-shell");
	return new NavigateRoute(cache, appShell, includes);
}
