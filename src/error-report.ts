import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import Vue from "vue";
import { ErrorRecordMessage } from "@/service-worker/client/installer";

if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			new VueIntegration({
				Vue,
				logErrors: true,
				attachProps: true,
			}),
		],
	});
}

class ServiceWorkerError extends Error {

	constructor(data: ErrorRecordMessage["data"]) {
		super();
		Object.assign(this, data);
	}
}

export function reportSWError(data: ErrorRecordMessage["data"]) {
	const e = new ServiceWorkerError(data);
	console.error(e);
	Sentry.captureException(e);
}
