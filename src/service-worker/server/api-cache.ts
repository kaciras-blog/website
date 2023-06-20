import { contentServiceURL } from "../../api/constants";
import { CacheWrapper, ManagedCache } from "./cache";
import { Route } from "./routing";
import { FetchFn, networkFirst, staleWhileRevalidate } from "./fetch-strategy";
import { bind, initPromise } from "./settings";

/*
 * 从页面代码里拦截 fetch 其实也行，但并未发现这有什么好处。
 *
 * 为了实现离线访问，Service Worker 里必须拦截 "fetch" 事件，而一旦注册了监听则所有请求都要
 * 等待 Service Worker 启动，没有办法区分 HTML 里的资源和 API 请求，故把缓存放到页面代码
 * 里也无法避免这一开销。
 */

class ApiOfflineRoute implements Route {

	private readonly host: string;
	private readonly cache: ManagedCache;

	private initPromise?: Promise<void>;

	private fetchFn!: FetchFn;

	constructor(host: string, cache: ManagedCache) {
		this.host = host;
		this.cache = cache;

		this.initPromise = initPromise.then(() => {
			bind("StaleApi", this.setStaleStrategy.bind(this));
			delete this.initPromise;
			this.handle = this.directHandle;
		});
	}

	setStaleStrategy(isEnable: boolean) {
		if (isEnable) {
			this.fetchFn = staleWhileRevalidate(this.cache);
			console.debug("[SW] API 请求模式设置为 StaleWhileRevalidate");
		} else {
			this.fetchFn = networkFirst(this.cache);
			console.debug("[SW] API 请求模式设置为 NetworkFirst");
		}
	}

	match(request: Request) {
		return new URL(request.url).host === this.host;
	}

	// 伪处理方法，该方法只为了等待配置加载，加载完后将被替换为 directHandle
	handle(event: FetchEvent) {
		const waitAndRespond = async () => {
			await this.initPromise;
			return this.fetchFn(event.request);
		};
		event.respondWith(waitAndRespond());
	}

	private directHandle(event: FetchEvent) {
		event.respondWith(this.fetchFn(event.request));
	}
}

/**
 * 对动态内容使用缓存，保证在网络不通的情况下也能显示旧的内容。
 */
export default function apiCacheRoute(cacheName: string) {
	const { host } = new URL(contentServiceURL);
	return new ApiOfflineRoute(host, new CacheWrapper(cacheName));
}
