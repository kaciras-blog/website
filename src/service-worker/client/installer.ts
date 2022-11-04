import { MessageType } from "../server/message";
import { setResult } from "./settings";
import { reportError } from "@/error-report";

const SCRIPT_PATH = "/sw.js";

function dispatchMessage(message: MessageEvent) {
	const { data } = message;
	switch (data.type) {
		case MessageType.Reply:
			setResult(data);
			break;
		case MessageType.Error:
			reportError(data.error);
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
		const list = await navigator.serviceWorker.getRegistrations();
		for (const registration of list) {
			await registration.unregister();
		}
		if (list.length > 0) {
			console.debug("[Init] ServiceWorker 已注销");
		}
	} catch (e) {
		console.error("[Init] ServiceWorker 注销失败", e);
	}
}

async function initialize() {
	try {
		const { status } = await fetch("/sw-check", { method: "HEAD" });
		return status === 200 ? register() : unregister();
	} catch (e) {
		console.warn("[Init] 无法获取注册指令，暂不更新 ServiceWorker ");
	}
}

/**
 * 等到空闲时注册 ServiceWorker，该函数只能在客户端使用。
 *
 * 【注意】
 * 若之前启用过，要禁用的话必须得注销，该函数始终需要被调用。
 */
export function useServiceWorker() {
	if (!("serviceWorker" in navigator)) {
		return;
	}
	if ("requestIdleCallback" in window) {
		requestIdleCallback(initialize);
	} else if (document.readyState === "complete") {
		void initialize();
	} else {
		window.addEventListener("load", initialize);
	}
}
