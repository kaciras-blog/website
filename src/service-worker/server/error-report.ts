// 把ServiceWorker里的错误发送到任意一个页面，然后提交到Sentry
import { MessageType } from "./message";

declare const clients: Clients;

function reportError(data: any) {
	const message = { type: MessageType.Error, data };
	clients.matchAll().then(clients => clients[0]?.postMessage(message));
	console.error(data);
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
