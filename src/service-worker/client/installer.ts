import { MessageType } from "../server/message";
import { putSetting, setResult } from "./settings";
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

/**
 * https://cconcolato.github.io/media-mime-support/
 * https://evilmartians.com/chronicles/better-web-video-with-av1-codec
 */
const codecMap: Record<string, string> = {
	opus: "video/mp4; codecs=opus",
	av1: "video/mp4; codecs=av01.0.05M.08",
};

/**
 * 检测浏览器是否支持一些新版的媒体编码，在 SW 中会修改请求尽量使用新版。
 */
function enableCodecUpgrade() {
	const video = document.createElement("video");
	const codecs = Object.keys(codecMap)
		.filter(k => video.canPlayType(codecMap[k]) === "probably");
	return putSetting("CodecSupport", codecs.join(","));
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
 * 启用 ServiceWorker 功能，该函数只能在客户端使用。
 *
 * 最好等到 window.load 事件时再注册，以免占用首屏宽带。
 *
 * 【注意】
 * 若之前启用过，要禁用的话必须得注销，该函数始终需要被调用。
 */
export function useServiceWorker() {
	if ("serviceWorker" in navigator) initialize();
}
