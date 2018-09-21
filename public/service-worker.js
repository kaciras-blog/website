const cacheName = "webCache";
const regex = new RegExp("^/static/");

self.addEventListener('install', event => {
	//waitUntil接受一个Promise，直到这个promise被resolve，安装阶段才算结束
	event.waitUntil(caches.open(cacheName));
});

self.addEventListener('fetch', event => {
	event.respondWith(requestOrCache(event.request));
});

async function requestOrCache(request) {
	const url = new URL(request.url);

	// 非前端静态资源直接转正常请求
	if(!regex.test(url.pathname)) {
		return await fetch(request);
	}

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
