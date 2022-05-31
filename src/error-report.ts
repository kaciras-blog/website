import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { App } from "vue";
import { Router } from "vue-router";

export function setupSentry(app: App, router: Router) {
	Sentry.init({
		app,
		dsn: import.meta.env.SENTRY_DSN,
		tracesSampleRate: 1.0,
		ignoreErrors: [
			/Network ?Error/,
			"Network request failed",
			"Failed to fetch",
		],
		attachProps: true,
		logErrors: true,
		integrations: [
			new BrowserTracing({
				routingInstrumentation: Sentry.vueRouterInstrumentation(router),
			}),
		],
		tunnel: import.meta.env.SENTRY_TUNNEL,
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
