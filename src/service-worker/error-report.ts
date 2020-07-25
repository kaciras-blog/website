// 把ServiceWorker里的错误发送到任意一个页面，然后提交到Sentry
import { MessageType } from "@/service-worker/message";

declare const clients: Clients;

function anycast(data: any) {
	const message = { type: MessageType.Error, data };
	clients.matchAll().then(clients => clients[0]?.postMessage(message));
}

self.addEventListener("error", (event) => anycast({
	type: "ERROR",
	message: event.message,
	stack: event.error?.stack,
}));

self.addEventListener("unhandledrejection", (event) => anycast({
	type: "REJECTION",
	message: event.reason?.message,
	stack: event.reason?.stack,
}));
