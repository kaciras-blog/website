const cacheName = "webCache";
const regex = new RegExp("^/static/"); // 仅匹配的请求才会缓存

self.addEventListener('install', event => {
	event.waitUntil(caches.open(cacheName));
});

self.addEventListener('fetch', event => {
	const request = event.request;
	const url = new URL(request.url);

	if(regex.test(url.pathname)) {
		event.respondWith(fetchWithCache(request));
	}
});

/**
 * 尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 *
 * @param request 请求对象
 * @return {Promise<Response>} 返回相应的Promise
 */
async function fetchWithCache(request) {
	// 如果请求的资源已被缓存，则直接返回
	const cached = await caches.match(request);
	if (cached) return cached;

	// 没有，则发起请求并缓存结果
	const requestClone = request.clone();
	const netRes = await fetch(requestClone);

	if (!netRes || netRes.status !== 200) {
		return netRes; // 非成功请求不缓存
	}
	const responseClone = netRes.clone();
	caches.open(cacheName).then(cache => cache.put(requestClone, responseClone));
	return netRes;
}
