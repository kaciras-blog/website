import { init, vueRouterInstrumentation } from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import { App } from "vue";
import { Router } from "vue-router";

export function setupSentry(app: App, router: Router) {
	init({
		app,
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 1.0,
		ignoreErrors: [
			/Network ?Error/,
			'Network request failed',
			'Failed to fetch'
		],
		attachProps: true,
		logErrors: true,
		integrations: [
			new Integrations.BrowserTracing({
				routingInstrumentation: vueRouterInstrumentation(router),
			})
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
