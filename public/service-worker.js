const cacheNames = new Set();

class CacheFetcher {

	constructor (name) {
		this.name = name;
		cacheNames.add(name);
	}

	async fetchAndCache (request) {
		const response = await fetch(request, { cache: "no-store" });
		if (response.status >= 200 && response.status < 400) {
			caches.open(this.name).then(cache => cache.put(request, response.clone()));
		}
		return response;
	}

	/**
	 * 缓存优先，并在后台更新。
	 */
	staleWhileRevalidate () {
		return async (request) => {
			const cached = await caches.match(request);
			if (cached) {
				this.fetchAndCache(request);
				return cached;
			}
			return await this.fetchAndCache(request);
		};
	}

	/**
	 * 缓存优先。尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
	 * 该策略适用于文件名中带 Hash 的请求。
	 */
	cacheFirst () {
		return async (request) => {
			// 如果请求的资源已被缓存，则直接返回
			const cached = await caches.match(request);
			if (cached) {
				return cached;
			}
			// 没有，则发起请求并缓存结果
			return await this.fetchAndCache(request);
		};
	}

	/**
	 * 网络优先，适用于频繁更新但又需要离线访问的内容。
	 */
	networkFirst () {
		return async (request) => {
			try {
				return await this.fetchAndCache(request);
			} catch (err) {
				const cached = await caches.match(request);
				if (cached) {
					return cached;
				}
				throw err;
			}
		};
	}
}


class CacheProxyServer {

	constructor () {
		this.routes = [];
	}

	addRoute (pattern, handler) {
		this.routes.push({ pattern, handler });
		return this;
	}

	handleFetchEvent (event) {
		const url = new URL(event.request.url);

		let matchedRoute;
		for (const route of this.routes) {
			if (route.pattern.test(url.pathname)) {
				matchedRoute = route;
				break;
			}
		}

		if (matchedRoute) {
			event.respondWith(matchedRoute.handler(event.request));
		}
	}

	fetchHandler () {
		return event => this.handleFetchEvent(event);
	}
}

const proxyServer = new CacheProxyServer();

const staticCache = new CacheFetcher("StaticResources");
proxyServer.addRoute(new RegExp("^/static/"), staticCache.cacheFirst());


self.addEventListener("install", event => {
	// event.waitUntil(caches.open(cacheName).then(a => a.addAll());
	return self.skipWaiting();
});

self.addEventListener("activate", event => {
	console.log("[ServiceWorker]: Activate");

	// 删除当前版本用不到的缓存
	event.waitUntil(caches.keys().then(keys =>
		Promise.all(keys.filter(k => !cacheNames.has(k)).map(k => caches.delete(k)))));

	return self.clients.claim();
});

self.addEventListener("fetch", proxyServer.fetchHandler());
