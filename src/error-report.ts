import * as Sentry from "@sentry/vue";
import { App } from "vue";
import { Router } from "vue-router";
import { name, version } from "../package.json";

export function setupSentry(app: App, router: Router) {
	Sentry.init({
		app,
		dsn: import.meta.env.SENTRY_DSN,
		release: `${name.replace("/", ".")}@${version}`,
		tracesSampleRate: 1.0,
		ignoreErrors: [
			/Network ?Error/,
			"Network request failed",
			"Failed to fetch",
			"TypeError: Load failed",
			"Unable to preload CSS",
			/(chrome|moz)-extension/,
		],
		attachProps: true,
		logErrors: true,
		integrations: [
			Sentry.browserTracingIntegration({ router }),
		],
		tunnel: import.meta.env.SENTRY_TUNNEL ? "/sentry" : undefined,

		// 禁止在添加追踪相关的请求头，这玩意会造成一些副作用。
		tracePropagationTargets: [],
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
