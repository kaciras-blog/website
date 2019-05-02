import { AsyncIndexedDB } from "./asyncdb";

declare const self: ServiceWorkerGlobalScope;


const EXPIATION_STORE_NAME = "cache-expiration";
const URL_KEY = "url";
const TIMESTAMP_KEY = "time";

export const UPDATE_CHANNEL_NAME = "PWA-UPDATE";

export const cacheNames = new Set<string>();


// TODO: 目前只有一种消息，所以直接搞个全局信道
let broadcastChannel: BroadcastChannel;
if ("BroadcastChannel" in self) {
	broadcastChannel = new BroadcastChannel(UPDATE_CHANNEL_NAME);
}

export function broadcastMessage(message: any) {
	if (broadcastChannel) {
		broadcastChannel.postMessage(message);
	} else {
		self.clients.matchAll({ type: "window" })
			.then(windows => windows.forEach(win => win.postMessage(message)));
	}
}

export interface ManagedCache {
	put(request: RequestInfo, response: Response): Promise<void>;
	match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined>;
}

/**
 * 简单封装下，把名字绑定了。
 */
export class CacheWrapper implements ManagedCache {

	private readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined> {
		return caches.open(this.name).then(cache => cache.match(request, options));
	}

	put(request: RequestInfo, response: Response): Promise<void> {
		return caches.open(this.name).then(cache => cache.put(request, response));
	}
}

/**
 * 有过期功能的缓存，过期信息记录在 IndexedDB 里。
 * 请使用 ExpirationCache.create(...) 来创建。
 */
export class ExpirationCache implements ManagedCache {

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

	// noinspection JSMethodCanBeStatic 可以搞个LRU？
	match(request: RequestInfo, options?: CacheQueryOptions) {
		return caches.match(request, options);
	}

	static async create(name: string, maxSize = undefined, maxAge = undefined) {
		const cache = new ExpirationCache(name, maxSize, maxAge);
		await cache.db.open(e => ExpirationCache.updateExpireStore(e));
		return cache;
	}
}
