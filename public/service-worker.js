const cacheName = "ServiceWorker";
const hashedResource = new RegExp("^/static/");

self.addEventListener("install", event => {
	event.waitUntil(caches.open(cacheName));
	return self.clients.claim();
});

self.addEventListener("activate", function () {
	console.log("[ServiceWorker] Activate");
});

self.addEventListener("fetch", event => {
	const request = event.request;
	const url = new URL(request.url);

	if (url.pathname === "/") {
		event.respondWith(networkFirst(request));
	} else if (hashedResource.test(url.pathname)) {
		event.respondWith(cacheFirst(request));
	}
});

function isSuccess (response) {
	return response && response.status >= 200 && response.status < 400;
}

/**
 * 缓存优先策略。尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 *
 * @param request 请求对象
 * @return {Promise<Response>} 返回相应的Promise
 */
async function cacheFirst (request) {
	// 如果请求的资源已被缓存，则直接返回
	const cached = await caches.match(request);
	if (cached) {
		return cached;
	}

	// 没有，则发起请求并缓存结果
	const requestClone = request.clone();
	const netResp = await fetch(requestClone);

	if (isSuccess(netResp)) {
		return netResp; // 非成功请求不缓存
	}
	const responseClone = netResp.clone();
	caches.open(cacheName).then(cache => cache.put(requestClone, responseClone));
	return netResp;
}

async function networkFirst (request) {
	try {
		const requestClone = request.clone();
		const netResp = await fetch(requestClone);

		if (isSuccess(netResp)) {
			const responseClone = netResp.clone();
			caches.open(cacheName).then(cache => cache.put(requestClone, responseClone));
		}
		return netResp;
	} catch (err) {
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		throw err;
	}
}
