interface CursorOptions {
	index?: string;
	range?: IDBKeyRange;
	direction?: IDBCursorDirection
}

type TransactionCallback = (tx: IDBTransaction, done: (value: any) => void, abort: () => void) => any;


export class AsyncDB {

	readonly name: string;
	readonly version?: number;

	private db: IDBDatabase;

	constructor(name, version) {
		this.name = name;
		this.version = version;
		this.db = null;
	}

	open(onUpgrade?, onVersionChange?) {
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
			const done = value => resolve(value);
			callback(tx, done, abort);
		});
	}

	withCursor(storeName: string, { index, range, direction }: CursorOptions, callback) {
		range = range || null;
		direction = direction || "next";

		return this.withTransaction(storeName, "readonly", tx => {
			const store = tx.objectStore(storeName);
			const cursorable = index ? store.index(index) : store;

			cursorable.openCursor(range, direction).onsuccess = (event: any) => {
				const cursor = event.target.result;
				if (cursor) callback(cursor);
			};
		});
	}

	count(storeName) {
		return this.withTransaction(storeName, "readonly", tx => tx.objectStore(storeName).count());
	}

	add(storeName, value) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).add(value));
	}

	delete(storeName, key) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).delete(key));
	}
}
