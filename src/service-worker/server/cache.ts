declare const self: ServiceWorkerGlobalScope;

/**
 * 记录所有使用中的缓存名，用于清理未使用的缓存。
 *
 * 【使用注意】
 * 所有缓存必须在执行清理之前创建，以便这里能记录它们。
 */
export const cacheNames = new Set<string>();

export async function cleanUnusedCache() {
	return Promise.all((await caches.keys()).map(deleteUnused));
}

async function deleteUnused(name: string) {
	if (cacheNames.has(name)) {
		return;
	}
	if (await caches.delete(name)) {
		console.debug("[SW] 删除了过期的缓存：" + name);
	} else {
		console.warn("[SW] 无法删除缓存：" + name);
	}
}

export interface ManagedCache {

	put(request: RequestInfo, response: Response): Promise<void>;

	match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined>;
}

/**
 * 简单包装下 self.caches，绑定名字并自动注册到已使用的缓存列表。
 */
export class CacheWrapper implements ManagedCache {

	private readonly name: string;

	constructor(name: string) {
		if (cacheNames.has(name)) {
			throw new Error(`ManagedCache ${name} already exists`);
		}
		this.name = name;
		cacheNames.add(name);
	}

	match(request: RequestInfo, options?: CacheQueryOptions) {
		return caches.open(this.name).then(cache => cache.match(request, options));
	}

	put(request: RequestInfo, response: Response) {
		return caches.open(this.name).then(cache => cache.put(request, response));
	}
}

/**
 * 启用静态资源缓存，在 SW 注册时就下载全部静态资源，并在更新时自动清理过期的。
 *
 * @param name 缓存空间的名字
 * @param assets 要缓存的 URL 列表
 */
export function useStaticCache(name: string, assets: string[]) {

	async function precache() {
		const cache = await caches.open(name);
		const alreadyCached = (await cache.keys()).map(request => request.url);
		const existing = new Set(alreadyCached);

		const toFetch = assets.filter(url => !existing.has(url));
		return cache.addAll(toFetch)
			.catch(e => console.error("[SW] 静态资源预加载失败", e));
	}

	async function expire() {
		const assetUrls = assets.map(v => new URL(v, location.href).href);
		const expected = new Set(assetUrls);

		const cache = await caches.open(name);
		const expired = (await cache.keys()).filter(r => !expected.has(r.url));

		for (const request of expired) {
			await cache.delete(request);
		}
		console.debug(`[SW] 清理了 ${expired.length} 个静态资源缓存。`);
	}

	self.addEventListener("install", event => event.waitUntil(precache()));
	self.addEventListener("activate", event => event.waitUntil(expire()));
}
