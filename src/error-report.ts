import * as Sentry from '@sentry/browser';
import Vue from "vue";
import * as Integrations from "@sentry/integrations";
import { ErrorRecordMessage } from "./serviceWorker";

export function enableAutoReport() {
	Sentry.init({
		dsn: 'https://3ec2222f7972477ba3007e0e0e8a99f2@sentry.io/1442466',
		integrations: [new Integrations.Vue({ Vue })],
	});
}

class TransferredServiceWorkerError extends Error {
}

export function report(message: ErrorRecordMessage) {
	const container = new TransferredServiceWorkerError();
	Sentry.captureException(Object.assign(container, message));
}
