import { cacheNames, ManagedCache } from "./cache";
import { AsyncIndexedDB } from "./asyncdb";

const STORE_NAME = "cache-expiration";
const URL_KEY = "url";
const TIMESTAMP_KEY = "time";

/**
 * 有过期功能的缓存，过期信息记录在 IndexedDB 里。
 * 使用 await ExpirationCache.create(...) 来创建该类的实例。
 */
export default class ExpirationCache implements ManagedCache {

	readonly name: string;
	readonly db: AsyncIndexedDB;

	readonly maxSize?: number;
	readonly maxAge?: number;

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
	 * @param event 升级事件
	 */
	private static updateExpireStore(event: any) {
		const db = event.target.result;
		db.createObjectStore(STORE_NAME, { keyPath: URL_KEY })
			.createIndex(TIMESTAMP_KEY, TIMESTAMP_KEY, { unique: false });
	}

	async put(request: RequestInfo, response: Response) {
		const { name, maxSize, maxAge, db } = this;
		const cache = await caches.open(name);

		const limit = maxSize || Number.MAX_SAFE_INTEGER;
		const period = maxAge ? Date.now() - maxAge * 1000 : 0;

		let count = 0;

		/**
		 * 遍历存储，
		 */
		async function eliminate(cursor: IDBCursorWithValue) {
			const { value } = cursor;

			if (count < limit && value[TIMESTAMP_KEY] > period) {
				count++;
			} else {
				await cache.delete(value.url);
				await db.delete(STORE_NAME, value.url);
			}

			cursor.continue();
		}

		await db.withCursor(STORE_NAME, { index: TIMESTAMP_KEY }, eliminate);

		await cache.put(request, response);
		await db.add(STORE_NAME, { [URL_KEY]: response.url, [TIMESTAMP_KEY]: Date.now() });
	}

	// 可以搞个LRU？
	async match(request: RequestInfo, options?: CacheQueryOptions) {
		return (await caches.open(this.name)).match(request, options);
	}

	/**
	 *
	 * @param name 缓存存储的名字
	 * @param maxSize 缓存数量上限
	 * @param maxAge 过期时间（毫秒）
	 */
	static async create(name: string, maxSize = undefined, maxAge = undefined) {
		const cache = new ExpirationCache(name, maxSize, maxAge);
		await cache.db.open(e => ExpirationCache.updateExpireStore(e));
		return cache;
	}
}
