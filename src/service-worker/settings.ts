import { DBSchema, IDBPDatabase, openDB } from "idb";

declare const self: ServiceWorkerGlobalScope;

interface Schema extends DBSchema {
	settings: {
		key: string;
		value: {
			key: string;
			value: any;
		};
	};
}

let database: IDBPDatabase<Schema>;

const listeners = new EventTarget();
const current = new Map<string, any>();

function upgradeDatabase(db: IDBPDatabase<Schema>) {
	db.createObjectStore("settings", { keyPath: "key" })
}

/**
 *
 * @param key
 * @param value
 */
export function set(key: string, value: any) {
	current.set(key, value);
	return database.put("settings", { key, value });
}

export function bind(key: string, callback: (value: any) => void) {
	callback(current.get(key));
	// listeners.addEventListener(key, event => callback(event.target.value))
}

function handleEvent(event: ExtendableMessageEvent) {

}

/**
 *
 */
export let initPromise: Promise<void>;

/**
 * 请在ServiceWorker启动时调用此函数。
 */
export function loadSettings() {
	initPromise = loadSettingsAsync();
}

async function loadSettingsAsync() {
	database = await openDB<Schema>(name, 1, { upgrade: upgradeDatabase });
	// database.transaction()
	const kvs = await database.getAll("settings");
	kvs.forEach(entity => current.set(entity.key, entity.value));

	self.addEventListener("message", handleEvent);
}

export interface SetConfigMessage {
	type: 1,
	key: string;
	value: any;
}
