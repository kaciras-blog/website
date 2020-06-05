import { broadcastMessage, ManagedCache } from "./cache";

export interface CachedFetcher {

	fetch(request: RequestInfo): Promise<Response>;
}

export abstract class BaseCachedFetcher implements CachedFetcher {

	protected readonly cache: ManagedCache;

	constructor(cache: ManagedCache) {
		this.cache = cache;
	}

	protected async fetchAndCache(request: RequestInfo) {
		const response = await fetch(request);
		if (response.status == 200) {
			await this.cache.put(request, response.clone());
		}
		return response;
	}

	abstract async fetch(request: RequestInfo): Promise<Response>;
}

/**
 * 网络优先，适用于频繁更新但又需要离线访问的内容。
 */
export class NetworkFirstFetcher extends BaseCachedFetcher {

	async fetch(request: RequestInfo) {
		try {
			return await this.fetchAndCache(request);
		} catch (err) {
			const cached = await this.cache.match(request);
			if (cached) {
				return cached;
			}
			throw err;
		}
	}
}

/**
 * 缓存优先，后台更新。
 *
 * 该策略能够保证最快的速度且允许离线访问，同时也能够更新资源，但是在后台更新需要用户下一次访问才能生效，
 * 通常给用户显示一个提示，让其刷新页面查看最新的内容。
 */
export class StaleWhileRevalidateFetcher extends BaseCachedFetcher {

	async fetch(request: RequestInfo) {
		const cached = await this.cache.match(request);
		if (cached) {
			this.fetchAndCache(request).then(newResp => this.broadcastUpdate(cached, newResp));
			return cached;
		}
		return this.fetchAndCache(request);
	}

	broadcastUpdate(cached: Response, newResp: Response) {
		if (!["content-length", "etag", "last-modified"].every(header => {
			return cached.headers.has(header) === newResp.headers.has(header)
				&& cached.headers.get(header) === newResp.headers.get(header);
		})) {
			broadcastMessage({ type: "CACHE_UPDATE", updatedUrl: newResp.url });
		}
	}
}

/**
 * 缓存优先，尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 适用于永不更新的资源，如带名字里带 Hash 的文件。
 */
export class CacheFirstFetcher extends BaseCachedFetcher {

	async fetch(request: RequestInfo) {
		const cached = await this.cache.match(request);
		if (cached) {
			return cached;
		}
		return this.fetchAndCache(request);
	}
}
