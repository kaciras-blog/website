import { FetchFn } from "./fetch-strategy.ts";

/*
 * ServiceWorker 的一大功能：拦截请求，本质上就是一个运行在浏览器中的代理。
 */

export interface Route {

	match(request: Request): boolean;

	handle(event: FetchEvent): void;
}

export class Router {

	private readonly routes: Route[] = [];

	/**
	 * 添加一个路由，注意没有删除方法，先添加的优先匹配。
	 *
	 * @param route 路由对象
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

		// 没有处理器就放过，走默认流程，请勿添加下列代码：
		// event.respondWith(fetch(event.request));
	}
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
