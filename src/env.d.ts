// noinspection JSUnusedGlobalSymbols
/// <reference types="@kaciras-blog/devtool/client" />

interface ImportMetaEnv {
	readonly SENTRY_DSN?: string;
	readonly GOOGLE_ANALYTICS_ID?: string;
}

interface Window {
	__INITIAL_STATE__?: any;	// SSR 的初始数据，没有表示该页未经服务端渲染。
	__SUPPORTED__: boolean;		// 浏览器是否受支持，见 support-check-3.js
}
