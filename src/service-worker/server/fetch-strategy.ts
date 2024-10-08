import { ManagedCache } from "./cache.ts";

/**
 * 发送请求的函数，就是 fetch 的类型，不过为了简洁省略掉了 init 参数
 */
export type FetchFn = (input: RequestInfo) => Promise<Response>;

/**
 * 发送请求，如果响应是可以缓存的则缓存响应。
 * 缓存的响应会添加一个头部 K-Fetch-Cached: 1
 *
 * @param input 请求
 * @param cache 缓存
 * @param fetchFn 发送请求的函数
 */
export async function fetchAndCache(input: RequestInfo, cache: ManagedCache, fetchFn: FetchFn) {
	const rawResponse = await fetchFn(input);

	if (rawResponse.status === 200) {
		// TODO: Firefox 在使用 HTTP3 时从 Stream body 创建新请求报错 NS_ERROR_NET_PARTIAL_TRANSFER
		rawResponse.clone().blob().then(blob => {
			const headers = new Headers(rawResponse.headers);
			headers.set("K-Fetch-Cached", "1");

			return cache.put(input, new Response(blob, {
				headers,
				status: rawResponse.status,
				statusText: rawResponse.statusText,
			}));
		});
	}

	return rawResponse;
}

/**
 * 网络优先，失败则回退到缓存，适用于频繁更新但又需要离线访问的内容。
 */
export function networkFirst(cache: ManagedCache, fetchFn: FetchFn = fetch) {
	return async (input: RequestInfo) => {
		try {
			return await fetchAndCache(input, cache, fetchFn);
		} catch (e) {
			const cached = await cache.match(input);
			if (cached) return cached; else throw e;
		}
	};
}

/**
 * 缓存优先 + 后台更新。该策略能够保证立即响应且允许离线访问，同时也能更新资源。
 *
 * 在后台更新需要下一次访问才能生效，通常给用户显示一个提示，让其刷新页面查看最新的内容。
 */
export function staleWhileRevalidate(cache: ManagedCache, fetchFn: FetchFn = fetch) {
	return async (input: RequestInfo) => {
		const fromFetch = fetchAndCache(input, cache, fetchFn);
		const fromCache = cache.match(input);

		// 这里竞速而不是缓存优先，因为缓存不一定比网络快。
		// 由于 fetch 不会返回 undefined，所以为空的一定是缓存，此时回退到网络。
		return (await Promise.any([fromCache, fromFetch])) ?? fromFetch;
	};
}

/**
 * 缓存优先，尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 适用于永不更新的资源，如带名字里带 Hash 的文件。
 */
export function cacheFirst(cache: ManagedCache, fetchFn: FetchFn = fetch) {
	return async (input: RequestInfo) => {
		const cached = await cache.match(input);
		return cached ? cached : fetchAndCache(input, cache, fetchFn);
	};
}
