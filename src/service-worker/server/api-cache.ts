import { CacheWrapper, ManagedCache } from "./cache";
import { Route } from "./routing";
import { FetchFn, networkFirst, staleWhileRevalidate, timeout } from "./fetch-strategy";
import { bind, initPromise } from "./settings";

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
			const ms = import.meta.env.TIMEOUT as unknown as number;
			this.fetchFn = networkFirst(this.cache, timeout(ms));
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
	const apiOrigin = import.meta.env.API_PUBLIC as any;
	const BASE_URL = typeof apiOrigin === "string"
		? apiOrigin
		: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];

	const { host } = new URL(BASE_URL);
	return new ApiOfflineRoute(host, new CacheWrapper(cacheName));
}
