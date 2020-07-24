import { ManagedCache } from "./cache";
import { Route } from "./routing";
import { FetchFn, staleWhileRevalidate } from "@/service-worker/fetch-strategy";


// Twitter 的代码里也是这样一个个写死的
// https://abs.twimg.com/responsive-web/serviceworker/main.e531acd4.js 格式化后的第6200行
const APP_SHELL_RE = new RegExp("^/(?:$|list|category|login|article|edit|profile|about|console|error)")

function fetchNavigationRequest() {

}

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

/**
 * 请打开
 *
 * @param cache
 * @param filename
 */
export default function appShellRoute(cache: ManagedCache, filename: string) {
	return new AppShellRoute(cache, filename, APP_SHELL_RE);
}
