import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import Vue from "vue";

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

	constructor(data: any) {
		super();
		Object.assign(this, data);
	}
}

export function reportError(data: any) {
	Sentry.captureException(new ServiceWorkerError(data));
}
