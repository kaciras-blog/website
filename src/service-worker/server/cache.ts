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
 * 启用静态资源缓存，可选在 SW 注册时下载全部静态资源，并在更新时自动清理过期的。
 *
 * <h2>是否需要预缓存</h2>
 * 预先下载资源可以让应用离线访问，但如果无此需求则浪费流量，
 * 不预载的话也能在首次使用时自动缓存，请视情况开启。
 *
 * @param name 缓存空间的名字
 * @param assets 要缓存的 URL 列表
 * @param precache 是否预先下载所有资源
 */
export function useStaticCache(name: string, assets: string[], precache = false) {

	async function fetchAll() {
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

	if (precache) {
		self.addEventListener("install", event => event.waitUntil(fetchAll()));
	}
	self.addEventListener("activate", event => event.waitUntil(expire()));
}
