import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import Vue from "vue";

if (process.env.SENTRY_DSN) {
	Sentry.init({
		Vue,
		dsn: process.env.SENTRY_DSN,
		attachProps: true,
		logErrors: true,
		integrations: [new Integrations.BrowserTracing()],
		tracesSampleRate: 1.0,
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
