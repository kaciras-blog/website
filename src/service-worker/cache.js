import { AsyncDB } from "./idb-async";

const EXPRIATION_STORE_NAME = "cache-expiration";
const URL_KEY = "url";
const TIMESTAMP_KEY = "time";

export const cacheNames = new Set();

export class ManagedCache {

	constructor (name, maxSize = null, maxAge = null) {
		if (cacheNames.has(name)) {
			throw new Error(`ManagedCache ${name} already exists.`);
		}
		cacheNames.add(name);

		this.name = name;
		this.maxSize = maxSize;
		this.maxAge = maxAge;

		this.db = new AsyncDB(name, 2);
		this.db.open(e => ManagedCache.updateExpireStore(e));
	}

	static updateExpireStore (event) {
		const db = event.target.result;
		db.createObjectStore(EXPRIATION_STORE_NAME, { keyPath: URL_KEY })
			.createIndex(TIMESTAMP_KEY, TIMESTAMP_KEY, { unique: false });
	}

	async put (request, response) {
		let { name, maxSize, maxAge, db } = this;
		const cache = await caches.open(name);

		maxSize = maxSize || Number.MAX_SAFE_INTEGER;
		const timePeriod = maxAge ? Date.now() - maxAge * 1000 : 0;
		let count = 0;

		await db.withCursor(EXPRIATION_STORE_NAME, { index: TIMESTAMP_KEY }, async cursor => {
			const value = cursor.value;

			if (count < maxSize && value[TIMESTAMP_KEY] > timePeriod) {
				count++;
			} else {
				await db.delete(value.url);
				await cache.delete(value.url);
			}
			cursor.continue();
		});

		return cache.then(cache => cache.put(request, response.clone()));
	}

	networkFirst () {
		return new NetworkFirstHandler(this);
	}

	cacheFirst () {
		return new CacheFirstHandler(this);
	}

	staleWhileRevalidate () {
		return new StaleWhileRevalidateHandler(this);
	}
}


class AbstractFetchHandler {

	constructor (cache) {
		this.cache = cache;
	}

	async fetchAndCache (event) {
		const { request, preloadResponse } = event;

		const response = preloadResponse
			|| await fetch(request, { cache: "no-store" });

		if (response.status >= 200 && response.status < 400) {
			this.cache.put(request, response);
		}
		return response;
	}

	/**
	 * @abstract
	 * @param request {Request}
	 * @return {Promise<Response>}
	 */
	async handle (request) {
		throw new Error("Not Impleted");
	}

	handleFetch (event) {
		event.respondWith(this.handle(event.request));
	}
}

/**
 * 网络优先，适用于频繁更新但又需要离线访问的内容。
 */
class NetworkFirstHandler extends AbstractFetchHandler {

	async handle (request) {
		try {
			return await this.fetchAndCache(request);
		} catch (err) {
			const cached = await caches.match(request);
			if (cached) {
				return cached;
			}
			throw err;
		}
	}
}

/**
 * 缓存优先，并在后台更新。
 */
class StaleWhileRevalidateHandler extends AbstractFetchHandler {

	async handle (request) {
		const cached = await caches.match(request);
		if (cached) {
			this.fetchAndCache(request);
			return cached;
		}
		return await this.fetchAndCache(request);
	}
}

/**
 * 缓存优先。尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 该策略适用于文件名中带 Hash 的请求。
 */
class CacheFirstHandler extends AbstractFetchHandler {

	async handle (request) {
		// 如果请求的资源已被缓存，则直接返回
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		// 没有，则发起请求并缓存结果
		return await this.fetchAndCache(request);
	}
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

export class CacheProxyServer {

	constructor () {
		this.routes = [];
	}

	/**
	 * 添加一个路由，注意没有删除方法，先添加的优先匹配。
	 *
	 * @param route {RegexRoute} 路由对象
	 * @return {CacheProxyServer} 链式调用返回自己
	 */
	addRoute (route) {
		this.routes.push(route);
		return this;
	}

	handleFetchEvent (event) {
		const { request } = event;

		if (request.method !== "GET") {
			return;
		}
		let matchedRoute;
		for (const route of this.routes) {
			if (route.match(request)) {
				matchedRoute = route;
				break;
			}
		}

		if (matchedRoute) {
			matchedRoute.handler.handle(event);
		}
	}

	fetchHandler () {
		return event => this.handleFetchEvent(event);
	}
}

export class RegexRoute {

	constructor (pattern, handler, blacklist = []) {
		if (typeof pattern === "string") {
			pattern = new RegExp(pattern).compile();
		}
		this.pattern = pattern;
		this.handler = handler;
		this.blacklist = blacklist;
	}

	match (request) {
		const { pattern, blacklist } = this;
		const url = new URL(request.url);
		if (!pattern.test(url)) {
			return false;
		}
		return blacklist.every(v => !v.test(url));
	}
}

export class NavigateRoute extends RegexRoute {

	match (request) {
		if (request.mode !== "navigate") {
			return false;
		}
		return super.match(request);
	}
}
