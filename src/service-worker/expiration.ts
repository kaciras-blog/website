import { cacheNames, ManagedCache } from "./cache";
import { DBSchema, IDBPDatabase, openDB } from "idb";

/*
 * 缓存过期信息的存储，使用 IndexedDB 实现。
 *
 * Table "expiration"
 * +-------------+----------------+
 * | url(string) | 🔑time(number) |
 * +-------------+----------------+
 */

const STORE_NAME = "expiration";
const URL_KEY = "url";
const TIMESTAMP_KEY = "time";

interface Schema extends DBSchema {
	expiration: {
		key: string;
		value: {
			url: string;
			time: number;
		};
		indexes: {
			time: number;
		};
	};
}

function valueOf(response: Response) {
	return { [URL_KEY]: response.url, [TIMESTAMP_KEY]: Date.now() };
}

/**
 * 如果数据库结构有变动则需要升级版本号，并在这个方法里创建新结构。
 *
 * 如果你需要修改一个已存在的对象仓库（例如要修改 keyPath），你必须先删除
 * 原先的对象仓库然后使用新的设置创建。（注意，这样会丢失对象仓库里的数据，
 * 如果你需要保存这些信息，你要在数据库版本更新前读取出来并保存在别处）。
 *
 * @param db 升级事件
 */
function createStore(db: IDBPDatabase<Schema>) {
	db.createObjectStore(STORE_NAME, { keyPath: URL_KEY })
		.createIndex(TIMESTAMP_KEY, TIMESTAMP_KEY, { unique: false });
}

/**
 * 有过期功能的缓存，过期信息记录在 IndexedDB 里。
 * 使用 await LastAdded.create(...) 来创建该类的实例。
 */
export class LastAdded implements ManagedCache {

	readonly db: IDBPDatabase<Schema>;

	readonly maxSize?: number;
	readonly maxAge?: number;

	protected constructor(db: IDBPDatabase<Schema>, maxSize?: number, maxAge?: number) {
		if (cacheNames.has(db.name)) {
			throw new Error(`ManagedCache ${name} already exists`);
		}
		cacheNames.add(db.name);

		this.db = db;
		this.maxSize = maxSize;
		this.maxAge = maxAge;
	}

	async put(request: RequestInfo, response: Response) {
		const { maxSize, maxAge, db } = this;
		const cache = await caches.open(db.name);

		const limit = maxSize || Number.MAX_SAFE_INTEGER;
		const period = maxAge ? Date.now() - maxAge * 1000 : 0;

		let cursor = await db.transaction(STORE_NAME).store.openCursor();
		let count = 0;

		while (cursor) {
			const { value } = cursor;

			if (count < limit && value[TIMESTAMP_KEY] > period) {
				count++;
				cursor = await cursor.continue();
			} else {
				await cursor.delete();
				await cache.delete(value.url);
			}
		}

		await cache.put(request, response);
		await db.add(STORE_NAME, valueOf(response));
	}

	// TODO 可以搞个LRU？
	async match(request: RequestInfo, options?: CacheQueryOptions) {
		return (await caches.open(this.db.name)).match(request, options);
	}
}

export class LRU extends LastAdded {

	async match(request: RequestInfo, options?: CacheQueryOptions) {
		const response = await super.match(request, options);
		if (response) {
			this.db.put(STORE_NAME, valueOf(response))
		}
		return response;
	}
}

interface ExpirationOptions {

	/** 缓存存储的名字 */
	name: string;

	/** 缓存数量上限 */
	maxSize?: number;

	/** 过期时间（毫秒 */
	maxAge?: number;

	/** 缓存策略 */
	strategy?: LastAdded;
}

/**
 * 创建一个具有过期功能的缓存存储。
 *
 * @param options 选项
 */
export async function expiration(options: ExpirationOptions) {
	const { name, maxSize, maxAge, strategy = LastAdded } = options;
	const db = await openDB<Schema>(name, 1, { upgrade: createStore });
	return new strategy(db, maxSize, maxAge)
}
