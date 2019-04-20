import * as Sentry from '@sentry/browser';

export interface ErrorRecordMessage {
	type: "ERROR" | "REJECTION",
	message: string | null;
	stack: string | null;
}

export function enableAutoReport() {
	Sentry.init({ dsn: 'https://3ec2222f7972477ba3007e0e0e8a99f2@sentry.io/1442466' });
}

class TransferredServiceWorkerError extends Error {}

export function report(message: ErrorRecordMessage) {
	const ex = new TransferredServiceWorkerError();
	Sentry.captureException(Object.assign(ex, message));
}

export function reportServiceWorkerErrors() {
	navigator.serviceWorker.addEventListener("message", (message) => {
		const { data } = message;
		if (data.type === "ERROR" || data.type === "REJECTION") report(data);
	});
}
