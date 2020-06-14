import { FetchFn, staleWhileRevalidate } from "./fetch-strategy";
import { ManagedCache } from "./cache";

export class Router {

	private readonly routes: Route[];

	constructor() {
		this.routes = [];
	}

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
	}
}

export interface Route {

	match(request: Request): boolean;

	handle(event: FetchEvent): void;
}

export class RegexRoute implements Route {

	private readonly pattern: RegExp;
	private readonly fetch: FetchFn;
	private readonly blacklist: RegExp[];

	constructor(pattern: string | RegExp, handler: FetchFn, blacklist: RegExp[] = []) {
		if (typeof pattern === "string") {
			pattern = new RegExp(pattern);
		}
		this.pattern = pattern;
		this.fetch = handler;
		this.blacklist = blacklist;
	}

	match(request: Request) {
		const { pattern, blacklist } = this;
		if (!pattern.test(request.url)) {
			return false;
		}
		return !blacklist.some(v => v.test(request.url));
	}

	handle(event: FetchEvent) {
		event.respondWith(this.fetch(event.request));
	}
}

export class AppShellRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly path: string;
	private readonly include?: RegExp;

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
		this.include = include;
	}

	match(request: Request) {
		if (request.mode !== "navigate") {
			return false;
		}
		if (!this.include) {
			return true;
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

/**
 * 处理导航请求预载的路由，需要把ServiceWorker的导航预载功能打开：
 *
 * @example
 * self.addEventListener("activate", (event: ExtendableEvent) => {
 *     if (self.registration.navigationPreload) {
 *         event.waitUntil(self.registration.navigationPreload.enable());
 *     }
 * }
 */
export class NavigatePreloadRoute implements Route {

	match(request: Request) {
		return request.mode === "navigate";
	}

	/**
	 * 检查下是否已经预载了，如果是就回复预载的响应，不是的话不管它让浏览器自己走网络加载。
	 * 特别注意 event.preloadResponse 一定要 await 之后再判断，不能直接 if(event.preloadResponse)。
	 *
	 * @param event 加载事件
	 */
	handle(event: FetchEvent) {
		const possiblePreload = async () => {
			const loaded = await event.preloadResponse;
			if (loaded) event.respondWith(loaded);
		};
		event.waitUntil(possiblePreload());
	}
}

/**
 * 如果浏览器支持WebP格式，则把图片请求的文件扩展名改为.webp。
 *
 * 【存在的问题】
 * WebP格式不一定就比原格式小，但哪个更优只能在服务端判断，该类只能一律使用WebP。
 * 首次访问网站时，因为ServiceWorker未安装而导致首屏的资源无法拦截，在Lighthouse等工具里会拉低评分。
 *
 * 【其他方案】
 * 在HTML里使用<picture> + <source>是最好的，但是CSS里没有类似的功能。
 */
export class WebpUpgradeRoute implements Route {

	private readonly fetch: FetchFn;
	private readonly pathPattern: RegExp;

	constructor(handler: FetchFn, pathPattern: RegExp) {
		this.fetch = handler;
		this.pathPattern = pathPattern;
	}

	match(request: Request) {
		const path = new URL(request.url).pathname;

		if (this.pathPattern.test(path)) {
			return request.headers.get("Accept")!.includes("image/webp");
		}
		return false;
	}

	async handle(event: FetchEvent) {
		const url = new URL(event.request.url);
		const path = url.pathname;

		url.pathname = path.substring(0, path.lastIndexOf(".")) + ".webp";
		const request = new Request(url.href, event.request);

		event.respondWith(this.fetch(request));
	}
}
