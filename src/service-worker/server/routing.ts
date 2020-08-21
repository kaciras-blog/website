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
 * 如果浏览器支持 WebP 格式，则把图片请求的文件扩展名改为.webp。
 *
 * 【存在的问题】
 * WebP 格式不一定就比原格式小，但哪个更优只能在服务端判断，该类只能一律使用 WebP。
 * 首次访问网站时，因为 ServiceWorker 未安装而导致首屏的资源无法拦截。
 *
 * 所以尽量从后端来支持 WebP 升级功能，如果后端支持则不需要使用本类。
 *
 * 【其他方案】
 * 在HTML里使用 <picture> + <source> 是最好的，但是 CSS 里没有类似的功能。
 */
export class WebpUpgradeRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly pathPattern: RegExp;

	constructor(fetchFn: FetchFn, pathPattern: RegExp) {
		this.fetch = fetchFn;
		this.pathPattern = pathPattern;
	}

	match(request: Request) {
		const { mode, url, headers } = request;
		if (mode === "navigate") {
			return false; // 新建标签页浏览图片
		}

		const path = new URL(url).pathname;
		if (!this.pathPattern.test(path)) {
			return false; // 只拦截特定路径的资源
		}

		// TODO: 升级浏览器到必须支持WebP?
		return headers.get("Accept")!.includes("image/webp");
	}

	async handle(event: FetchEvent) {
		const url = new URL(event.request.url);
		const path = url.pathname;

		url.pathname = path.substring(0, path.lastIndexOf(".")) + ".webp";
		const request = new Request(url.href, event.request);

		event.respondWith(this.fetch(request));
	}
}

/**
 * 应用外壳模式（AppShell）的路由，拦截导航请求并返回缓存的HTML文件。
 *
 * 【关于竞速的讨论】
 * 我曾设想让缓存读取AppShell与网络请求来竞速，以提升某些情况下的加载时间，并减少用户看到旧版页面的次数。
 * 但这个尝试失败了，因为：
 * 1）后端SSR返回的页面包含了数据，而AppShell没有，两者不对等不能直接竞速。
 * 2）NavigationPreload 的兼容性还不行，在不支持的浏览器上发网络请求要等SW启动太慢。
 */
export class AppShellRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly path: string;
	private readonly include: RegExp;

	/**
	 * 新建应用外壳路由，其将使用指定URI路径的页面作为应用的外壳，并将其缓存。
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

	// 【坑】Request 默认缓存是不去服务端检查的，而AppShell文件名不带Hash，必须禁用缓存防止无法更新
	// https://developer.mozilla.org/zh-CN/docs/Web/API/Request/cache
	handle(event: FetchEvent) {
		const request = new Request(this.path, { cache: "no-cache" });
		event.respondWith(this.fetch(request));
	}
}
