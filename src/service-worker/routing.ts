import { RequestHandler, StaleWhileRevalidateHandler } from "./cache-strategy";
import { ManagedCache } from "./cache";

/**
 * 缓存服务器，检查传入的请求是否命中缓存，如果是则直接返回缓存的结果，否则不做任何
 * 动作（不做动作的话浏览器默认会正常发送请求）
 */
export class Routing {

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
		return this;
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

	private pattern: RegExp;
	private handler: RequestHandler;
	private blacklist: RegExp[];

	constructor(pattern: string | RegExp, handler: RequestHandler, blacklist: RegExp[] = []) {
		if (typeof pattern === "string") {
			pattern = new RegExp(pattern);
		}
		this.pattern = pattern;
		this.handler = handler;
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
		event.respondWith(this.handler.handle(event.request));
	}
}

export class AppShellRoute implements Route {

	private readonly handler: StaleWhileRevalidateHandler;
	private readonly path: string;

	/**
	 * 新建应用外壳路由，其将使用指定URI路径的页面作为应用的外壳，并将其缓存。
	 *
	 * @param cache 缓存
	 * @param path 应用外壳的URI路径
	 */
	constructor(cache: ManagedCache, path: string) {
		this.path = path;
		this.handler = new StaleWhileRevalidateHandler(cache);
	}

	match(request: Request) {
		return request.mode === "navigate";
	}

	handle(event: FetchEvent) {
		event.respondWith(this.handler.handle(this.path))
	}
}

/**
 * 处理导航请求预载的路由，需要把ServiceWorker的导航预载功能打开。
 */
export class NavigatePreloadRoute implements Route {

	match(request: Request) {
		return request.mode === "navigate";
	}

	/**
	 * 检查下是有已经预载了，如果是就回复预载的响应，不是的话不管它让浏览器自己走网络加载。
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
