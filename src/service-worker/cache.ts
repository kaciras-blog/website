declare const self: ServiceWorkerGlobalScope;

import { AsyncIndexedDB } from "./asyncdb";

const EXPIATION_STORE_NAME = "cache-expiration";
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
	readonly db: AsyncIndexedDB;

	private constructor(name: string, maxSize?: number, maxAge?: number) {
		if (cacheNames.has(name)) {
			throw new Error(`ManagedCache ${name} already exists`);
		}
		cacheNames.add(name);

		this.name = name;
		this.maxSize = maxSize;
		this.maxAge = maxAge;

		this.db = new AsyncIndexedDB(name, 1);
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
		db.createObjectStore(EXPIATION_STORE_NAME, { keyPath: URL_KEY })
			.createIndex(TIMESTAMP_KEY, TIMESTAMP_KEY, { unique: false });
	}

	async put(request: RequestInfo, response: Response) {
		const { name, maxSize, maxAge, db } = this;
		const cache = await caches.open(name);

		const sizeLimit = maxSize || Number.MAX_SAFE_INTEGER;
		const timePeriod = maxAge ? Date.now() - maxAge * 1000 : 0;
		let count = 0;

		await db.withCursor(EXPIATION_STORE_NAME, { index: TIMESTAMP_KEY }, async cursor => {
			const value = cursor.value;

			if (count < sizeLimit && value[TIMESTAMP_KEY] > timePeriod) {
				count++;
			} else {
				await db.delete(EXPIATION_STORE_NAME, value.url);
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

	// BroadcastChannel 可能不支持，不过我懒得管了
	staleWhileRevalidate(channelName?: string, request?: RequestInfo) {
		let channel;
		if (channelName && "BroadcastChannel" in self) {
			channel = new BroadcastChannel(channelName);
		}
		return new StaleWhileRevalidateHandler(this, channel, request);
	}

	static async create(name: string, maxSize = undefined, maxAge = undefined) {
		const cache = new ManagedCache(name, maxSize, maxAge);
		await cache.db.open(e => ManagedCache.updateExpireStore(e));
		return cache;
	}
}


export abstract class FetchHandler {

	protected readonly cache: ManagedCache;

	constructor(cache: ManagedCache) {
		this.cache = cache;
	}

	protected async fetchAndCache(request: RequestInfo) {
		const response = await fetch(request, { cache: "no-store" });
		if (response.status == 200) {
			await this.cache.put(request, response);
		}
		return response;
	}

	abstract async handle(event: FetchEvent): Promise<Response>;
}

/**
 * 网络优先，适用于频繁更新但又需要离线访问的内容。
 */
class NetworkFirstHandler extends FetchHandler {

	async handle(event: FetchEvent) {
		try {
			return await this.fetchAndCache(event.request);
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
 * 缓存优先，后台更新。
 *
 * 该策略能够保证最快的速度且允许离线访问，同时也能够更新资源，但是在后台更新需要用户下一次访问才能生效，
 * 通常可以给用户显示一个提示让其刷新页面。
 */
class StaleWhileRevalidateHandler extends FetchHandler {

	private readonly channel?: BroadcastChannel;
	private readonly request?: RequestInfo;

	constructor(cache: ManagedCache, channel?: BroadcastChannel, request?: RequestInfo) {
		super(cache);
		this.channel = channel;
		this.request = request;
	}

	async handle(event: FetchEvent) {
		const request = this.request || event.request;
		const cached = await caches.match(request);
		if (cached) {
			this.fetchAndCache(request).then(newResp => this.broadcastUpdate(cached, newResp));
			return cached;
		}
		return await this.fetchAndCache(request);
	}

	broadcastUpdate(cached: Response, newResp: Response) {
		const { channel, cache } = this;
		if (!channel) {
			return;
		}
		const same = ["content-length", "etag", "last-modified"].every(header => {
			return cached.headers.has(header) === newResp.headers.has(header)
				&& cached.headers.get(header) === newResp.headers.get(header);
		});

		if (same) {
			return;
		}
		const message = { type: "CACHE_UPDATE", cacheName: cache.name, updatedUrl: newResp.url };
		if(channel) {
			channel.postMessage(message);
		} else {
			self.clients.matchAll({ type: "window" })
				.then(windows => windows.forEach(win => win.postMessage(message)));
		}
	}
}

/**
 * 缓存优先。尝试从缓存里加载响应，如果缓存中没有则发送请求，并将成功的响应加入缓存。
 * 适用于永不更新的资源，如带文件名带 HASH 的文件。
 */
class CacheFirstHandler extends FetchHandler {

	async handle(event: FetchEvent) {
		const cached = await caches.match(event.request);
		if (cached) {
			return cached;
		}
		return await this.fetchAndCache(event.request);
	}
}
