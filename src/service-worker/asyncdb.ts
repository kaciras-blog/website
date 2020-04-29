/*
 * 封装IndexedDB，所有的方法均为异步的。
 *
 * 主要参考了Google的 workbox 项目：
 * https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-core/src/_private/DBWrapper.ts
 */
export interface CursorOptions {
	index?: string;
	range?: IDBKeyRange;
	direction?: IDBCursorDirection
}

/** 事务和游标的回调 */
export type TransactionCallback = (tx: IDBTransaction, done: (value: any) => void, abort: () => void) => void;
export type CursorCallback = (cursor: IDBCursorWithValue) => void;

/** 两个事件的处理函数，比较长就搞个别名 */
export type IDBUpdateHandler = (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any | null;
export type IDBonVersionChangeHandler = ((this: IDBDatabase, ev: IDBVersionChangeEvent) => any) | null;


export class AsyncIndexedDB {

	readonly name: string;
	readonly version?: number;

	private db?: IDBDatabase;

	constructor(name: string, version?: number) {
		this.name = name;
		this.version = version;
	}

	open(onUpgrade: IDBUpdateHandler, onVersionChange: IDBonVersionChangeHandler = null) {
		if (this.db) {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.name, this.version);
			request.onupgradeneeded = onUpgrade;
			request.onsuccess = (event: any) => {
				resolve();
				const db = this.db = event.target.result;
				db.onversionchange = onVersionChange;
			};
			request.onerror = () => reject(request.error);
		});
	}

	withTransaction(storeNames: string | string[], type: IDBTransactionMode, callback: TransactionCallback) {
		return new Promise((resolve, reject) => {

			// 目前只有 ManagedCache.create 创建该类的实例，所以能肯定此时数据库一定已经打开了
			const tx = (this.db as IDBDatabase).transaction(storeNames, type);
			tx.oncomplete = () => resolve();
			tx.onerror = (event: any) => reject(event.target.error);
			tx.onabort = (event: any) => reject(event.target.error);

			const abort = () => tx.abort();
			const done = (value: any) => resolve(value);
			callback(tx, done, abort);
		});
	}

	withCursor(storeName: string, { index, range, direction }: CursorOptions, callback: CursorCallback) {
		return this.withTransaction(storeName, "readonly", tx => {
			const store = tx.objectStore(storeName);
			const cursorable = index ? store.index(index) : store;

			cursorable.openCursor(range, direction).onsuccess = (event: any) => {
				const cursor = event.target.result;
				if (cursor) callback(cursor);
			};
		});
	}

	count(storeName: string) {
		return this.withTransaction(storeName, "readonly", tx => tx.objectStore(storeName).count());
	}

	add(storeName: string, value: any) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).add(value));
	}

	delete(storeName: string, key: any) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).delete(key));
	}

	/** 通常ServiceWorker中的数据库不需要关闭 */
	close() {
		if (this.db) {
			this.db.close();
			this.db = undefined;
		}
	}
}
