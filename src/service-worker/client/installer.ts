import { PostMessage, RPC } from "@kaciras/utilities/browser";
import { reportError } from "@/error-report";
import { SWServerAPI } from "../server/index.ts";

const SCRIPT_PATH = "/sw.js";

const functions = { reportError };

export type SWClientAPI = typeof functions;

const post: PostMessage = (message, transfer) => {
	navigator.serviceWorker.controller?.postMessage(message, transfer);
};

const client = import.meta.env.SSR ? (null as never) : RPC.createClient<SWServerAPI>(post, rec => {
	navigator.serviceWorker.addEventListener("message", e => rec(e.data));
});

export function putSetting<T>(key: string, value: T) {
	return client.setOption(key, value);
}

/**
 * 获取全部 ServiceWorker 配置选项。
 */
export function getSettings() {
	return client.getOptions();
}

async function register() {
	try {
		await navigator.serviceWorker.register(SCRIPT_PATH);

		const serve = RPC.createServer(functions);
		navigator.serviceWorker.addEventListener("message", e => serve(e.data));

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
		console.warn("[Init] 无法获取注册指令，暂不更新 ServiceWorker");
	}
}

/**
 * 等到空闲时注册 ServiceWorker，该函数只能在客户端使用。
 *
 * 【注意】
 * 若之前启用过，要禁用的话必须得注销，该函数始终需要被调用。
 */
export function useServiceWorker() {
	if (!navigator.serviceWorker) {
		return;
	}
	if ("requestIdleCallback" in window) {
		requestIdleCallback(initialize);
	} else if (document.readyState === "complete") {
		void initialize();
	} else {
		// @ts-ignore For Safari.
		window.addEventListener("load", initialize);
	}
}
