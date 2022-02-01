// 注意导入顺序，因为打包后CSS里元素的顺序跟导入顺序一致，所以 main.ts 必须靠前
import { setupSentry } from "./error-report";
import "./misc";
import createBlogApp, { mediaQueryPlugin } from "./main";
import { useServiceWorker } from "@/service-worker/client/installer";
import { SUN_PHASES } from "@/store";
import { REFRESH_USER, SET_SUN_PHASE } from "@/store/types";
import { ClientPrefetchMixin, installRouterHooks, prefetch } from "./client-prefetch";

interface CustomGlobals {
	__INITIAL_STATE__?: any;
	__isSupport__: boolean;
}

declare const window: Window & CustomGlobals;

const { app, router, store } = createBlogApp(window.__INITIAL_STATE__);

app.mixin(ClientPrefetchMixin);

if (import.meta.env.SENTRY_DSN && window.__isSupport__) {
	setupSentry(app, router);
}

function initApplication() {
	app.mount("#app");

	// Vue3 在激活时似乎不会重新设置元素的属性，必须把这俩放挂载后面。
	mediaQueryPlugin.observeWindow(store);
	SUN_PHASES.observe().subscribe(value => store.commit(SET_SUN_PHASE, value));

	installRouterHooks(store, router);

	// 切换视图后关掉所有弹窗
	router.afterEach(() => (app as any).$dialog.clear());
}

async function appShellStartup() {
	const route = router.currentRoute.value;

	const cs = route.matched.flatMap(v => v.components);
	await prefetch(store, route, cs);

	initApplication();

	// 把注册延迟到渲染完成之后，避免首屏显示前占用资源
	useServiceWorker();

	// AppShell 模式不会在服务端加载用户
	// TODO: 这会导致控制台不能直接访问（以及刷新），但不是什么严重的问题
	await store.dispatch(REFRESH_USER);
}

// 如果有 window.__INITIAL_STATE__ 全局属性则说明使用了服务端渲染。
if (window.__INITIAL_STATE__) {

	// 服务端渲染的 HTML 包括了首屏资源，所以要延迟到 load 事件避免占用
	window.addEventListener("load", useServiceWorker);

	// 在服务端渲染下，将初始化注册到 onReady 上，
	// 使其在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
	router.isReady().then(initApplication);
} else {

	// 在客户端渲染下，同样用 onReady 确保异步组件都加载完再预载数据。
	router.isReady().then(appShellStartup);
}
