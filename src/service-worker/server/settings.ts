import { createNanoEvents } from "nanoevents";
import { DBSchema, IDBPDatabase, openDB } from "idb";

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
	StaleApi: false,
};

function upgradeDatabase(db: IDBPDatabase<Schema>) {
	db.createObjectStore("settings", { keyPath: "key" });
}

/**
 * 修改配置项，配置项将持久化存储。
 *
 * @param key 配置项名
 * @param value 新值
 * @return 等待配置生效的Promise
 */
export function set(key: string, value: any) {
	current[key] = value;
	emitter.emit(key, value);
	return database.put("settings", { key, value });
}

export function getAll() {
	return current;
}

/**
 * 绑定配置项，会立即将当前的值传入处理函数。
 * 此后，每当配置项有更改，处理函数也将被调用。
 *
 * @param key 配置名
 * @param handler 处理函数
 */
export function bind(key: string, handler: (value: any) => void) {
	handler(current[key]);
	emitter.on(key, handler);
}

async function loadSettings() {
	database = await openDB<Schema>("app", 1, { upgrade: upgradeDatabase });
	const kvs = await database.getAll("settings");
	kvs.forEach(({ key, value }) => current[key] = value);
}

/**
 * 表示配置都加载完成，任何读取配置的地方都应该等待此 Promise。
 *
 * @example
 * import { initPromise, get } from "./settings";
 *
 * initializeSettingManager();
 *
 * async function doSomething() {
 *     await initPromise;
 *     console.log("key: " + get("key"));
 * }
 */
export const initPromise = loadSettings();
