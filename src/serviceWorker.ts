import { UPDATE_CHANNEL_NAME } from "./service-worker/fetch-strategy";
import { report } from "./error-report";

const SCRIPT_PATH = "/sw.js";

export interface ErrorRecordMessage {
	type: "ERROR" | "REJECTION",
	stack: string | null;
	message: string | null;
}

export interface ServiceWorkerConfig {
	onResourceUpdate?: (data: any) => void;
}

const callbacks = new Map<number, object>();
let messageCounter = 0;

export function setConfig<T>(key: string, value: T) {
	const id = messageCounter++;
	navigator.serviceWorker.controller?.postMessage({ type: 1, id, key, value });
	return new Promise<T>((resolve, reject) => callbacks.set(id, { resolve, reject }));
}

interface ReplyMessage {
	type: "REPLY",
	id: number;
}

interface SuccessReplyMessage extends ReplyMessage {
	resolve: any;
}

interface ErrorReplyMessage extends ReplyMessage {
	reject: Error;
}

export function register(config: ServiceWorkerConfig = {}) {

	/**
	 * 注册成功后调用，添加资源更新的监听。
	 */
	function afterRegister() {
		const { onResourceUpdate } = config;

		if (onResourceUpdate) {
			if ("BroadcastChannel" in window) {
				const channel = new BroadcastChannel(UPDATE_CHANNEL_NAME);
				channel.onmessage = (message) => onResourceUpdate(message.data);
			} else {
				navigator.serviceWorker.addEventListener("message", (message) => {
					if (message.data.type === "CACHE_UPDATE") onResourceUpdate(message.data);
				});
			}
		}

		navigator.serviceWorker.addEventListener("message", (message) => {
			const { data } = message;
			if (data.type === "ERROR" || data.type === "REJECTION") report(data);
			if (data.type === 1) {

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

		const response = await fetch("/sw-check", { method: "HEAD" });
		if (response.status !== 200) {
			console.debug("[Init] ServiceWorker 已注销");
			return unregister();
		}

		navigator.serviceWorker.register(SCRIPT_PATH)
			.then(afterRegister)
			.catch((err) => console.error("[Init] ServiceWorker 注册失败：", err));
	});
}

/**
 * 注销 ServiceWorker，没有检查 ServiceWorker 是否注销完成，因为就算注销失败也没有什么办法处理。
 */
function unregister() {
	navigator.serviceWorker.getRegistrations()
		.then(regs => regs.forEach(reg => reg.unregister()))
		.catch(() => console.error("Service worker failed to unregister."));
}

/*
 * 生产模式下注册 ServiceWorker，开发模式禁用。
 * 注意：要禁用的话不能只是不注册，而必须得注销！
 */
export function useServiceWorker() {
	if ("serviceWorker" in navigator) {
		process.env.NODE_ENV === "production" ? register() : unregister();
	}
}
