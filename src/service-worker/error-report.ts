function anycastMessage(message: any) {
	self.clients.matchAll().then((clients) => {
		if (clients && clients.length) {
			clients[0].postMessage(message);
		}
	});
}

self.addEventListener('error', (err) => {
	anycastMessage({
		type: 'ERROR',
		message: err.message || null,
		stack: err.error ? err.error.stack : null
	});
});

self.addEventListener('unhandledrejection', (err: any) => {
	anycastMessage({
		type: 'REJECTION',
		message: err.reason ? err.reason.message : null,
		stack: err.reason ? err.reason.stack : null
	});
});
