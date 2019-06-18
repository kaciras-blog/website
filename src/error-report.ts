import * as Sentry from '@sentry/browser';
import Vue from "vue";
import * as Integrations from "@sentry/integrations";
import { ErrorRecordMessage } from "./serviceWorker";

if (process.env.CONFIG.sentryDSN) {
	Sentry.init({
		dsn: process.env.CONFIG.sentryDSN,
		integrations: [new Integrations.Vue({ Vue })],
	});
}

class TransferredServiceWorkerError extends Error {}

export function report(message: ErrorRecordMessage) {
	const container = new TransferredServiceWorkerError();
	Sentry.captureException(Object.assign(container, message));
}
