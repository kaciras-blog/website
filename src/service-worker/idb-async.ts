interface CursorOptions {
	index?: string;
	range?: IDBKeyRange; // IE errors if range === `undefined`.
	direction?: IDBCursorDirection
}

/** 事务和游标的回调 */
type TransactionCallback = (tx: IDBTransaction, done: (value: any) => void, abort: () => void) => void;
type CursorCallback = (cursor: IDBCursorWithValue) => void;

type IDBUpdateHandler = (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any | null;
type IDBonVersionChangeHandler = ((this: IDBDatabase, ev: IDBVersionChangeEvent) => any) | null;


export class AsyncDB {

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
				this.db = event.target.result;
				this.db.onversionchange = onVersionChange;
			};
			request.onerror = () => reject(request.error);
		});
	}

	withTransaction(storeNames: string | string[],
					type: IDBTransactionMode,
					callback: TransactionCallback) {

		return new Promise((resolve, reject) => {
			const tx = this.db.transaction(storeNames, type);
			tx.onerror = (event: any) => reject(event.target.error);
			tx.onabort = (event: any) => reject(event.target.error);
			tx.oncomplete = () => resolve();

			const abort = () => tx.abort();
			const done = (value: any) => resolve(value);
			callback(tx, done, abort);
		});
	}

	withCursor(storeName: string, { index, range = null, direction }: CursorOptions,
			   callback: CursorCallback) {

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
}
