import type { RPCMethods } from "../client/installer.ts";
import { RPC } from "@kaciras/utilities/browser";

declare const clients: Clients;

export interface ServiceWorkerError {
	type: "ERROR" | "REJECTION";
	name: string;
	stack?: string;
	message?: string;
}

// 把 ServiceWorker 里的错误发送到任意一个页面，由其提交到 Sentry。
async function reportError(error: ServiceWorkerError) {
	const [client] = await clients.matchAll();
	if (!client) {
		return console.error(error);
	}
	const post = client.postMessage.bind(client);
	await RPC.createClient<RPCMethods>(post).reportError(error);
}

self.addEventListener("error", (event) => reportError({
	type: "ERROR",
	name: event.error.name,
	message: event.message,
	stack: event.error.stack,
}));

self.addEventListener("unhandledrejection", (event) => reportError({
	type: "REJECTION",
	name: event.reason.name,
	message: event.reason.message,
	stack: event.reason.stack,
}));
