import { ManagedCache } from "./cache";

/**
 * 发送请求的函数，就是 fetch 的类型，不过为了简洁省略掉了 init 参数
 */
export type FetchFn = (input: RequestInfo) => Promise<Response>;

/**
 * 发送请求，如果响应是可以缓存的则缓存响应。
 *
 * 缓存的响应会添加一个头部 X-Service-Worker: cached
 *
 * @param input 请求
 * @param cache 缓存
 * @param fetchFn 发送请求的函数
 * @return 原始响应
 */
export async function fetchAndCache(input: RequestInfo, cache: ManagedCache, fetchFn: FetchFn) {
	const rawResponse = await fetchFn(input);

	if (rawResponse.status === 200) {
		const headers = new Headers(rawResponse.headers);
		headers.set("X-Service-Worker", "cached");

		// Edge 79 之前的版本有BUG，不能用 body 属性来创建新请求。
		// 该情况下可以用 body = await rawResponse.clone().arrayBuffer();
		// https://stackoverflow.com/a/42846899/7065321
		const { body } = rawResponse.clone();
		const response = new Response(body, {
			headers,
			status: rawResponse.status,
			statusText: rawResponse.statusText,
		});

		cache.put(input, response).catch(e => console.error(e));
	}

	return rawResponse;
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

			// 都抄了 OptionalChaining，咋就不能抄全了，把 ThrowExpression 也拿来。
			// return (await cache.match(input)) ?? throw err;
		}
	};
}

/**
 * 缓存优先，后台更新。该策略能够保证立即响应且允许离线访问，同时也能更新资源。
 *
 * 因为在后台更新需要用户下一次访问才能生效，通常给用户显示一个提示，让其刷新页面查看最新的内容。
 */
export function staleWhileRevalidate(cache: ManagedCache, fetchFn: FetchFn = fetch) {

	return async (input: RequestInfo) => {
		const fromCache = cache.match(input);
		const fromFetch = fetchAndCache(input, cache, fetchFn);

		// 假定缓存永远比网络快
		const cached = await fromCache;
		if (!cached) {
			return fromFetch;
		}

		// TODO: 是否需要 event.waitUtil(fromFetch)?
		return cached;
	};
}

/**
 * 缓存优先，尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 适用于永不更新的资源，如带名字里带 Hash 的文件。
 */
export function cacheFirst(cache: ManagedCache, fetchFn: FetchFn = fetch) {

	return async (input: RequestInfo) => {
		const cached = await cache.match(input);
		if (cached) {
			return cached;
		}
		return fetchAndCache(input, cache, fetchFn);
	};
}
