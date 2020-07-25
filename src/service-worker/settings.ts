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

const emitter = createNanoEvents();

// 定死所有值？
const current: { [key: string]: any } = {
	AppShell: false,
	StaleApi: false,
};

function upgradeDatabase(db: IDBPDatabase<Schema>) {
	db.createObjectStore("settings", { keyPath: "key" })
}

/**
 * 修改配置项，配置项将持久化存储。
 *
 * @param key 配置项名
 * @param value 新值
 * @return 表示持久化完成的Promise
 */
export function set(key: string, value: any) {
	current[key] = value;
	emitter.emit(key, value);
	return database.put("settings", { key, value });
}

export function get(key: string) {
	return current[key];
}

/**
 * 绑定配置项，会立即将当前的值传入处理函数。
 * 此后，每当配置项有更改，处理函数也将被调用。
 *
 * @param key 配置名
 * @param handler 处理函数
 */
export function bind(key: string, handler: (value: any) => void) {
	handler(current.get(key));
	emitter.on(key, handler);
}

// TODO: 再有其他类型的消息时把这函数移出去
async function handleEvent(event: ExtendableMessageEvent) {
	const { type, id, data } = event.data;

	function reply(result: any) {

		// @ts-ignore TypeScript 的 BUG？
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

async function loadSettings() {
	database = await openDB<Schema>("temp2", 1, { upgrade: upgradeDatabase });
	const kvs = await database.getAll("settings");
	kvs.forEach(entity => current.set(entity.key, entity.value));
}

/**
 *
 *
 * 因为ServiceWorker里的存储API都是异步的，所以只能这么写。
 */
export let initPromise: Promise<void>;

/**
 *
 *
 * 请在ServiceWorker启动时调用此函数，否则配置将不可用。
 */
export function initializeSettingManager() {
	self.addEventListener("message", handleEvent);
	initPromise = loadSettings();
}
