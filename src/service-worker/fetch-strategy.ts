import { broadcastMessage, ManagedCache } from "./cache";

export type FetchFn = (input: RequestInfo) => Promise<Response>;

async function fetchAndCache(request: RequestInfo, cache: ManagedCache, fetchFn: FetchFn) {
	const response = await fetchFn(request);
	if (response.status == 200) {
		cache.put(request, response.clone());
	}
	return response;
}

function broadcastUpdate(cached: Response, newResp: Response) {
	if (!["content-length", "etag", "last-modified"].every(header => {
		return cached.headers.has(header) === newResp.headers.has(header)
			&& cached.headers.get(header) === newResp.headers.get(header);
	})) {
		broadcastMessage({ type: "CACHE_UPDATE", updatedUrl: newResp.url });
	}
}

/**
 * 限制请求时间，如果超时则取消请求。
 *
 * @param time 超时时间（毫秒）
 * @param fetchFn 内层 fetch 函数
 */
export function timeout(time: number, fetchFn: FetchFn = fetch) {

	return (input: RequestInfo) => {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), time);

		input = new Request(input, { signal: controller.signal });
		return fetchFn(input).finally(() => clearTimeout(timer));
	};
}

/**
 * 网络优先，适用于频繁更新但又需要离线访问的内容。
 */
export function networkFirst(cache: ManagedCache, fetchFn: FetchFn = fetch) {

	return async (input: RequestInfo) => {
		try {
			return await fetchAndCache(input, cache, fetchFn);
		} catch (err) {
			const cached = await cache.match(input);
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
export function staleWhileRevalidate(cache: ManagedCache, fetchFn: FetchFn = fetch) {

	return async (request: RequestInfo) => {
		const cached = await cache.match(request);
		if (cached) {
			fetchAndCache(request, cache, fetchFn).then(newResp => broadcastUpdate(cached, newResp));
			return cached;
		}
		return fetchAndCache(request, cache, fetchFn);
	};
}

/**
 * 缓存优先，尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 适用于永不更新的资源，如带名字里带 Hash 的文件。
 */
export function cacheFirst(cache: ManagedCache, fetchFn: FetchFn = fetch) {

	return async (request: RequestInfo) => {
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}
		return fetchAndCache(request, cache, fetchFn);
	}
}
