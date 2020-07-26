import { MessageType } from "@/service-worker/message";
import { report } from "./error-report";

interface ReplyMessage {
	id: number;
	type: MessageType.Reply;
	result?: any;
	error?: Error;
}

interface PromiseController {

	resolve(value?: any): void;

	reject(reason?: any): void;
}

let messageCounter = 0;

const callbacks = new Map<number, PromiseController>();

function sendMessage<T>(type: MessageType, data?: any) {
	const id = messageCounter++;
	navigator.serviceWorker.controller?.postMessage({ type, id, data });
	return new Promise<T>((resolve, reject) => callbacks.set(id, { resolve, reject }));
}

export function putSetting<T>(key: string, value: T) {
	return sendMessage<T>(MessageType.PutSetting, { key, value });
}

export function getSettings() {
	return sendMessage(MessageType.GetSettings);
}

function setResult(data: ReplyMessage) {
	const promise = callbacks.get(data.id);
	if (!promise) {
		return;
	}
	callbacks.delete(data.id)

	if ("error" in data) {
		promise.reject(data.error);
	} else {
		promise.resolve(data.result);
	}
}

// ===================================================================================

const SCRIPT_PATH = "/sw.js";

export interface ErrorRecordMessage {
	type: MessageType.Error;
	data: {
		type: "ERROR" | "REJECTION",
		stack: string | null;
		message: string | null;
	};
}

export function initialize() {

	/**
	 * 注册成功后调用，添加资源更新的监听。
	 */
	function afterRegister() {
		navigator.serviceWorker.addEventListener("message", message => {
			const { data } = message;
			switch (data.type) {
				case MessageType.Reply:
					setResult(data);
					break;
				case MessageType.Error:
					report(data);
					break;
			}
		});

		console.debug("[Init] ServiceWorker 注册成功");
	}

	// 等到 window.load 事件时再注册，以免 ServiceWorker 里加载的资源占用首屏宽带
	window.addEventListener("load", async () => {

		const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
		if (publicUrl.origin !== window.location.origin) {
			return console.error("service worker won't work when PUBLIC_URL is on a different origin");
		}

		try {
			const response = await fetch("/sw-check", { method: "HEAD" });
			if (response.status !== 200) {
				unregister();
			} else {
				navigator.serviceWorker.register(SCRIPT_PATH)
					.then(afterRegister)
					.catch(e => console.error("[Init] ServiceWorker 注册失败", e));
			}
		} catch (e) {
			console.warn("[Init] 无法获取ServiceWorker注册指令，暂不更新ServiceWorker")
		}
	});
}

/**
 * 注销 ServiceWorker，没有检查 ServiceWorker 是否注销完成，因为就算注销失败也没有什么办法处理。
 */
function unregister() {
	navigator.serviceWorker.getRegistrations()
		.then(regs => regs.forEach(reg => reg.unregister()))
		.then(() => console.debug("[Init] ServiceWorker 已注销"))
		.catch(e => console.error("[Init] ServiceWorker 注销失败", +e));
}

/*
 * 启用ServiceWorker功能，该函数只能在客户端使用。
 *
 * 【注意】
 * 若之前启用过，要禁用的话必须得注销，该函数始终需要被调用。
 */
export function useServiceWorker() {
	if ("serviceWorker" in navigator) initialize();
}
