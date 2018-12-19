declare const self: ServiceWorkerGlobalScope;

import { AsyncDB } from "./idb-async";

const EXPRIATION_STORE_NAME = "cache-expiration";
const URL_KEY = "url";
const TIMESTAMP_KEY = "time";

export const cacheNames = new Set<string>();

/**
 * 对缓存的封装，增加了过期功能。
 */
export class ManagedCache {

	readonly name: string;
	readonly maxSize?: number;
	readonly maxAge?: number;
	readonly db: AsyncDB;

	private constructor(name: string, maxSize?: number, maxAge?: number) {
		if (cacheNames.has(name)) {
			throw new Error(`ManagedCache ${name} already exists.`);
		}
		cacheNames.add(name);

		this.name = name;
		this.maxSize = maxSize;
		this.maxAge = maxAge;

		this.db = new AsyncDB(name, 1);
	}

	/**
	 * 如果数据库结构有变动则需要升级版本号，并在这个方法里创建新结构。
	 *
	 * 如果你需要修改一个已存在的对象仓库（例如要修改 keyPath），你必须先删除
	 * 原先的对象仓库然后使用新的设置创建。（注意，这样会丢失对象仓库里的数据，
	 * 如果你需要保存这些信息，你要在数据库版本更新前读取出来并保存在别处）。
	 *
	 * @param event {IDBVersionChangeEvent} 升级事件
	 */
	private static updateExpireStore(event: any) {
		const db = event.target.result;
		db.createObjectStore(EXPRIATION_STORE_NAME, { keyPath: URL_KEY })
			.createIndex(TIMESTAMP_KEY, TIMESTAMP_KEY, { unique: false });
	}

	async put(request: RequestInfo, response: Response) {
		const { name, maxSize, maxAge, db } = this;
		const cache = await caches.open(name);

		const sizeLimit = maxSize || Number.MAX_SAFE_INTEGER;
		const timePeriod = maxAge ? Date.now() - maxAge * 1000 : 0;
		let count = 0;

		await db.withCursor(EXPRIATION_STORE_NAME, { index: TIMESTAMP_KEY }, async cursor => {
			const value = cursor.value;

			if (count < sizeLimit && value[TIMESTAMP_KEY] > timePeriod) {
				count++;
			} else {
				await db.delete(EXPRIATION_STORE_NAME, value.url);
				await cache.delete(value.url);
			}
			cursor.continue();
		});

		return await cache.put(request, response.clone());
	}

	networkFirst() {
		return new NetworkFirstHandler(this);
	}

	cacheFirst() {
		return new CacheFirstHandler(this);
	}

	staleWhileRevalidate(channelName?: string) {
		let channel;
		if (channelName && "BroadcastChannel" in self) {
			channel = new BroadcastChannel(channelName);
		}
		return new StaleWhileRevalidateHandler(this, channel);
	}

	static async create(name: string, maxSize = undefined, maxAge = undefined) {
		const cache = new ManagedCache(name, maxSize, maxAge);
		await cache.db.open(e => ManagedCache.updateExpireStore(e));
		return cache;
	}
}


abstract class AbstractFetchHandler {

	protected readonly cache: ManagedCache;

	constructor(cache: ManagedCache) {
		this.cache = cache;
	}

	protected async fetchAndCache(event: FetchEvent) {
		const { request, preloadResponse } = event;

		let response = preloadResponse && await preloadResponse;
		if (response) {
			return response; // Shell 依赖于预加载缓存
		}

		response = await fetch(request, { cache: "no-store" });
		if (response.status >= 200 && response.status < 400) {
			await this.cache.put(request, response);
		}
		return response;
	}

	abstract async handle(event: FetchEvent): Promise<Response>;
}

/**
 * 网络优先，适用于频繁更新但又需要离线访问的内容。
 */
class NetworkFirstHandler extends AbstractFetchHandler {

	async handle(event: FetchEvent) {
		try {
			return await this.fetchAndCache(event);
		} catch (err) {
			const cached = await caches.match(event.request);
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

	private readonly channel?: BroadcastChannel;

	constructor(cache: ManagedCache, channel?: BroadcastChannel) {
		super(cache);
		this.channel = channel;
	}

	async handle(event: FetchEvent) {
		const cached = await caches.match(event.request);
		if (cached) {
			this.fetchAndCache(event).then(newResp => this.boradcastUpdate(cached, newResp));
			return cached;
		}
		return await this.fetchAndCache(event);
	}

	boradcastUpdate(cached: Response, newResp: Response) {
		const { channel, cache } = this;
		if (!channel) {
			return;
		}
		const same = ["content-length", "etag", "last-modified"].every(header => {
			return cached.headers.has(header) === newResp.headers.has(header)
				&& cached.headers.get(header) === newResp.headers.get(header);
		});
		if (!same) {
			channel.postMessage({
				type: "CACHE_UPDATE",
				cacheName: cache.name,
				updatedUrl: newResp.url,
			});
		}
	}
}

/**
 * 缓存优先。尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 该策略适用于文件名中带 Hash 的请求。
 */
class CacheFirstHandler extends AbstractFetchHandler {

	async handle(event: FetchEvent) {
		// 如果请求的资源已被缓存，则直接返回
		const cached = await caches.match(event.request);
		if (cached) {
			return cached;
		}
		// 没有，则发起请求并缓存结果
		return await this.fetchAndCache(event);
	}
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

export class CacheProxyServer {

	private readonly routes: RegexRoute[];

	constructor() {
		this.routes = [];
	}

	/**
	 * 添加一个路由，注意没有删除方法，先添加的优先匹配。
	 *
	 * @param route 路由对象
	 * @return 链式调用返回自己
	 */
	addRoute(route: RegexRoute) {
		this.routes.push(route);
		return this;
	}

	private handleFetchEvent(event: FetchEvent) {
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

		if (!matchedRoute) {
			return;
		}
		event.respondWith(matchedRoute.handler.handle(event));
	}

	/**
	 * 注册抓取事件，这个方法只能在最外层调用。
	 */
	addFetchListener() {
		self.addEventListener('fetch', (event: FetchEvent) => this.handleFetchEvent(event));
	}
}

export class RegexRoute {

	private pattern: RegExp;
	private blacklist: RegExp[];

	handler: AbstractFetchHandler;

	constructor(pattern: string | RegExp, handler: AbstractFetchHandler, blacklist: RegExp[] = []) {
		if (typeof pattern === "string") {
			pattern = new RegExp(pattern);
		}
		this.pattern = pattern;
		this.handler = handler;
		this.blacklist = blacklist;
	}

	match(request: Request) {
		const { pattern, blacklist } = this;
		if (!pattern.test(request.url)) {
			return false;
		}
		return blacklist.every(v => !v.test(request.url));
	}
}

export class NavigateRoute extends RegexRoute {

	match(request: Request) {
		if (request.mode !== "navigate") {
			return false;
		}
		return super.match(request);
	}
}
