/**
 * 记录所有使用中的缓存名，用于清理未使用的缓存。
 *
 * 【使用注意】
 * 所以缓存必须在执行清理之前创建，以便这里能记录它们。
 */
export const cacheNames = new Set<string>();

export async function cleanUnusedCache() {
	(await caches.keys()).filter(k => !cacheNames.has(k)).map(deleteCache);
}

async function deleteCache(name: string) {
	if (await caches.delete(name)) {
		console.debug("[SW] 删除了过期的缓存：" + name);
	} else {
		console.warn("[SW] 无法删除过期的缓存：" + name);
	}
}

export interface ManagedCache {

	put(request: RequestInfo, response: Response): Promise<void>;

	match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined>;
}

/**
 * 简单包装下self.caches。
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
