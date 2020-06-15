declare const clients: Clients;

function anycastMessage(message: any) {
	clients.matchAll().then(clients => clients[0]?.postMessage(message));
}

self.addEventListener("error", (event) => anycastMessage({
	type: "ERROR",
	message: event.message,
	stack: event.error?.stack,
}));

self.addEventListener("unhandledrejection", (event) => anycastMessage({
	type: "REJECTION",
	message: event.reason?.message,
	stack: event.reason?.stack,
}));
