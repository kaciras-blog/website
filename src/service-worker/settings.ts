import { DBSchema, IDBPDatabase, openDB } from "idb";
import { MessageType } from "./message";
import { createNanoEvents } from 'nanoevents'

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

const emitter = createNanoEvents()
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
	const dbPromise = database.put("settings", { key, value });
	current.set(key, value);
	emitter.emit(key, value);
	return dbPromise;
}

export function bind(key: string, callback: (value: any) => void) {
	callback(current.get(key));
	emitter.on(key, callback);
}

async function handleEvent(event: ExtendableMessageEvent) {
	const { type, id, data } = event.data;

	function reply(result: any) {
		event.source.postMessage({ type: MessageType.Reply, id, result });
	}

	switch (type) {
		case MessageType.GetSettings:
			await initPromise;
			reply(current);
			break;
		case MessageType.setOption:
			await set(data.key, data.value);
			reply(data.value);
			break;
		default:
			throw new Error("Unknown message type: " + data.type);
	}
}

/**
 *
 */
export let initPromise: Promise<void>;

/**
 * 请在ServiceWorker启动时调用此函数。
 */
export function initializeSettingManager() {
	self.addEventListener("message", handleEvent);
	initPromise = loadSettingsAsync();
}

async function loadSettingsAsync() {
	database = await openDB<Schema>("temp2", 1, { upgrade: upgradeDatabase });
	// database.transaction()
	const kvs = await database.getAll("settings");
	kvs.forEach(entity => current.set(entity.key, entity.value));

}
