import { MessageType } from "../server/message";
import { setResult } from "./settings";
import { reportSWError } from "@/error-report";

const SCRIPT_PATH = "/sw.js";

export interface ErrorRecordMessage {
	type: MessageType.Error;
	data: {
		type: "ERROR" | "REJECTION",
		name: string;
		stack?: string;
		message?: string;
	};
}

function dispatchMessage(message: MessageEvent) {
	const { data } = message;
	switch (data.type) {
		case MessageType.Reply:
			setResult(data);
			break;
		case MessageType.Error:
			reportSWError(data.data);
			break;
		default:
			throw new Error("Unknown message type: " + data.type);
	}
}

async function register() {
	try {
		await navigator.serviceWorker.register(SCRIPT_PATH);
		navigator.serviceWorker.addEventListener("message", dispatchMessage);
		console.debug("[Init] ServiceWorker 注册成功");
	} catch (e) {
		console.error("[Init] ServiceWorker 注册失败", e);
	}
}

async function unregister() {
	try {
		const registration = await navigator.serviceWorker.ready;
		await registration.unregister();
		console.debug("[Init] ServiceWorker 已注销");
	} catch (e) {
		console.error("[Init] ServiceWorker 注销失败", e)
	}
}

export async function initialize() {
	const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
	if (publicUrl.origin !== window.location.origin) {
		return console.error("service worker won't work when PUBLIC_URL is on a different origin");
	}
	try {
		const { status } = await fetch("/sw-check", { method: "HEAD" });
		return status === 200 ? register() : unregister();
	} catch (e) {
		console.warn("[Init] 无法获取ServiceWorker注册指令，暂不更新ServiceWorker");
	}
}

/**
 * 启用ServiceWorker功能，该函数只能在客户端使用。
 *
 * 等到 window.load 事件时再注册，以免 ServiceWorker 里加载的资源占用首屏宽带。
 *
 * 【注意】
 * 若之前启用过，要禁用的话必须得注销，该函数始终需要被调用。
 */
export function useServiceWorker() {
	if ("serviceWorker" in navigator) initialize();
}
