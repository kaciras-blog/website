import { MessageType } from "../server/message";

interface ReplyMessage {
	id: number;
	type: MessageType.Reply;
	result?: any;
	error?: Error;
}

/**
 * 超时句柄和 Promise 构造方法的两个参数。
 */
interface PromiseController {
	timer: number;
	resolve(value?: any): void;
	reject(reason?: any): void;
}

/**
 * 给每个发送的消息加上一个递增的ID，用于回复。
 */
let messageCounter = 0;

const callbacks = new Map<number, PromiseController>();

// ServiceWorker 是否注册成功应当提前检查，这里认为 controller 一定不为 null。
function sendMessage<T>(type: MessageType, data?: any) {
	const id = messageCounter++;
	navigator.serviceWorker.controller!.postMessage({ type, id, data });

	function rejectTimeout() {
		const promise = callbacks.get(id);
		callbacks.delete(id);
		promise!.reject(new Error("ServiceWorker message timeout"));
	}

	const timer = setTimeout(rejectTimeout, 4000);
	return new Promise<T>((resolve, reject) => callbacks.set(id, { timer, resolve, reject }));
}

export function setResult(data: ReplyMessage) {
	const callback = callbacks.get(data.id);
	if (!callback) {
		return;
	}
	callbacks.delete(data.id);
	clearTimeout(callback.timer);

	if ("error" in data) {
		callback.reject(data.error);
	} else {
		callback.resolve(data.result);
	}
}

/**
 * 设置 ServiceWorker 配置的选项值。
 *
 * @param key 选项名
 * @param value 值
 * @return 等待配置已存储并生效的Promise
 */
export function putSetting<T>(key: string, value: T) {
	return sendMessage<void>(MessageType.PutSetting, { key, value });
}

/**
 * 获取全部 ServiceWorker 配置选项。
 */
export function getSettings() {
	return sendMessage<object>(MessageType.GetSettings);
}
