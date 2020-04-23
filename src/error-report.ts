import Vue from "vue";
import * as Sentry from '@sentry/browser';
import * as Integrations from "@sentry/integrations";
import { ErrorRecordMessage } from "./serviceWorker";

const { SENTRY_DSN } = process.env.CONFIG as any
if (SENTRY_DSN) {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [new Integrations.Vue({ Vue })],
	});
}

class TransferredServiceWorkerError extends Error {}

export function report(message: ErrorRecordMessage) {
	const container = new TransferredServiceWorkerError();
	Sentry.captureException(Object.assign(container, message));
}
