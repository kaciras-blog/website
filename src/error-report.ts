import Vue from "vue";
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { ErrorRecordMessage } from "./serviceWorker";

const { SENTRY_DSN } = process.env;
if (SENTRY_DSN) {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [new VueIntegration({ Vue, attachProps: true })],
	});
}

class TransferredServiceWorkerError extends Error {}

export function report(message: ErrorRecordMessage) {
	const container = new TransferredServiceWorkerError();
	Sentry.captureException(Object.assign(container, message));
}
