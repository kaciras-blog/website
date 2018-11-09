export class AsyncDB {

	constructor (name, version) {
		this.name = name;
		this.version = version;
		this.db = null;
	}

	open (onUpgrade, onVersionChange) {
		if (this.db) {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.name, this.version);
			request.onupgradeneeded = onUpgrade;
			request.onsuccess = event => {
				resolve();
				this.db = event.target.result;
				this.db.onversionchange = onVersionChange;
			};
			request.onerror = () => reject(request.error);
		});
	}

	withTransaction (storeNames, type, callback) {
		if (!(storeNames instanceof Array)) {
			storeNames = [storeNames];
		}
		return new Promise((resolve, reject) => {
			const tx = this.db.transaction(storeNames, type);
			tx.onerror = event => reject(event.target.error);
			tx.onabort = event => reject(event.target.error);
			tx.oncomplete = () => resolve();

			const abort = () => tx.abort();
			const done = value => resolve(value);
			callback(tx, done, abort);
		});
	}

	withCursor (storeName, { index, range, direction }, callback) {
		range = range || null;
		direction = direction || "next";

		this.withTransaction(storeName, "readonly", tx => {
			let store = tx.objectStore(storeName);
			store = index ? store.index(index) : store;

			store.openCursor(range, direction).onsuccess = event => {
				const cursor = event.target.result;
				if (cursor) callback(cursor);
			};
		});
	}

	add (storeName, value) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).add(value));
	}

	delete (storeName, key) {
		return this.withTransaction(storeName, "readwrite", tx => tx.objectStore(storeName).delete(key));
	}
}
