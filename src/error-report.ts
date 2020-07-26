import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import Vue from "vue";
import { ErrorRecordMessage } from "./serviceWorker";

if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [new VueIntegration({ Vue, attachProps: true })],
	});
}

class ServiceWorkerError extends Error {

	constructor(data: ErrorRecordMessage["data"]) {
		super();
		Object.assign(this, data);
		this.name = "ServiceWorkerError";
	}
}

export function reportSWError(data: ErrorRecordMessage["data"]) {
	Sentry.captureException(new ServiceWorkerError(data));
}
