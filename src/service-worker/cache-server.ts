import { FetchHandler } from "./cache";

declare const self: ServiceWorkerGlobalScope;

/**
 * 缓存服务器，检查传入的请求是否命中缓存，如果是则直接返回缓存的结果，否则不做任何
 * 动作（不做动作的话浏览器默认会正常发送请求）
 */
export class CacheProxyServer {

	private readonly routes: RegexRoute[];

	constructor() {
		this.routes = [];
	}

	/**
	 * 添加一个路由，注意没有删除方法，先添加的优先匹配。
	 *
	 * @param route 路由对象
	 * @return 链式调用返回自己
	 */
	addRoute(route: RegexRoute) {
		this.routes.push(route);
		return this;
	}

	handleFetchEvent(event: FetchEvent) {
		const { request } = event;

		self.clients.matchAll({ type: "window" })
			.then(windows => windows.forEach(win => win.postMessage("test!!!")));

		// TODO: temp
		if (event.request.mode === "navigate") {
			const requestNavigateRequest = async () => {
				const preloadResponse = await event.preloadResponse;
				if (preloadResponse) {
					return preloadResponse;
				}
				return await fetch(event.request);
			};
			event.respondWith(requestNavigateRequest());
		}

		if (request.method !== "GET") {
			return; // 仅缓存没有副作用的GET请求
		}

		for (const route of this.routes) {
			if (route.match(request)) {
				return event.respondWith(route.handler.handle(event));
			}
		}
	}
}

export class RegexRoute {

	private pattern: RegExp;
	private blacklist: RegExp[];

	handler: FetchHandler;

	constructor(pattern: string | RegExp, handler: FetchHandler, blacklist: RegExp[] = []) {
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
}

export class NavigateRoute extends RegexRoute {

	constructor(handler: FetchHandler) {
		super("", handler);
	}

	match(request: Request) {
		return request.mode === "navigate";
	}
}
