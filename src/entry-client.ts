import { observeMediaQuery } from "@kaciras-blog/uikit";
import { setupSentry } from "./error-report";
import createBlogApp from "./main";
import { useServiceWorker } from "@/service-worker/client/installer";
import { useCurrentUser } from "@/store";
import { installRouterHooks, prefetch } from "./client-prefetch";

interface CustomGlobals {
	__INITIAL_STATE__?: any;	// SSR 的初始数据，没有表示该页未经服务端渲染。
	__SUPPORTED__: boolean;		// 浏览器是否受支持，见 support-check-2.js
}

declare const window: Window & CustomGlobals;

const { app, router, store } = createBlogApp(window.__INITIAL_STATE__);

if (import.meta.env.SENTRY_DSN && window.__SUPPORTED__) {
	setupSentry(app, router);
}

/**
 * 初始化应用的各个模块并挂载，该函数是客户端的入口点。
 *
 * <h1>挂载到 body</h1>
 * 很多框架都不建议这样做，因为会跟一些三方库冲突，特别是在 body 末尾加 script 的。
 * 但 Vue3 并未警告，而且从原理上看似乎可行，所以先试试如果不行再改回去。
 */
function initApplication() {
	observeMediaQuery(store);
	app.mount(document.body);
	installRouterHooks(store, router);
}

async function appShellStartup() {
	const route = router.currentRoute.value;

	const cs = route.matched.flatMap(v => v.components!.default);
	await prefetch(store, route, cs);

	initApplication();

	// 把注册延迟到渲染完成之后，避免首屏显示前占用资源
	useServiceWorker();

	// AppShell 模式不会在服务端加载用户
	// TODO: 这会导致控制台不能直接访问（以及刷新），但不是什么严重的问题
	await useCurrentUser(store).refresh();
}

// 如果有 window.__INITIAL_STATE__ 全局属性则说明使用了服务端渲染。
if (window.__INITIAL_STATE__) {
	useServiceWorker();

	// 在服务端渲染下，将初始化注册到 onReady 上，
	// 使其在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
	router.isReady().then(initApplication);
} else {

	// 在客户端渲染下，同样用 onReady 确保异步组件都加载完再预载数据。
	router.isReady().then(appShellStartup);
}
