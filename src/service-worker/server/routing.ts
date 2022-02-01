import { FetchFn, staleWhileRevalidate } from "./fetch-strategy";
import { ManagedCache } from "./cache";

export class Router {

	private readonly routes: Route[] = [];

	/**
	 * 添加一个路由，注意没有删除方法，先添加的优先匹配。
	 *
	 * @param route 路由对象
	 * @return 链式调用返回自己
	 */
	addRoute(route: Route) {
		this.routes.push(route);
	}

	route(event: FetchEvent) {
		const { request } = event;

		if (request.method !== "GET") {
			return; // 仅缓存没有副作用的GET请求
		}

		for (const route of this.routes) {
			if (route.match(request)) {
				return route.handle(event);
			}
		}

		// 没有处理器就放过，走默认请求流程，请勿添加下列代码：
		// event.respondWith(fetch(event.request));
	}
}

export interface Route {

	match(request: Request): boolean;

	handle(event: FetchEvent): void;
}

export class RegexRoute implements Route {

	private readonly pattern: RegExp;
	private readonly fetch: FetchFn;
	private readonly exclude?: RegExp;

	constructor(pattern: string | RegExp, fetchFn: FetchFn, exclude?: RegExp) {
		if (typeof pattern === "string") {
			pattern = new RegExp(pattern);
		}
		this.pattern = pattern;
		this.fetch = fetchFn;
		this.exclude = exclude;
	}

	match(request: Request) {
		const { pattern, exclude } = this;
		if (!pattern.test(request.url)) {
			return false;
		}
		if (!exclude) {
			return true;
		}
		return exclude.test(request.url);
	}

	handle(event: FetchEvent) {
		event.respondWith(this.fetch(event.request));
	}
}

/**
 * 处理导航请求的路由，根据情况返回网络请求或缓存的 AppShell。
 * 记得打开 navigationPreload 功能。
 */
export class NavigateRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly path: string;
	private readonly include: RegExp;

	/**
	 * 新建导航路由，其将使用指定URI路径的页面作为应用的外壳，并将其缓存。
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
	 * 1）后端 SSR 返回的页面包含了数据，而 AppShell 没有，两者不对等不能直接竞速。
	 * 2）NavigationPreload 的兼容性还不行，在不支持的浏览器上发网络请求要等SW启动太慢。
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
			console.warn("导航预载失败，尝试使用 AppShell");
		}
		return this.fetch(new Request(this.path, { cache: "no-cache" }));
	}
}
