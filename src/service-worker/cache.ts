/**
 * 记录所有使用中的缓存名，用于清理未使用的缓存
 */
export const cacheNames = new Set<string>();

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
