// 注意导入顺序，因为打包后CSS里元素的顺序跟导入顺序一致，所以 main.ts 必须靠前
import "./error-report";
import "./misc";
import Vue from "vue";
import createApp, { mediaQueryPlugin } from "./main";
import { useServiceWorker } from "@/service-worker/client/installer";
import { SUN_PHASES } from "@/store";
import { REFRESH_USER, SET_SUN_PHASE } from "@/store/types";
import * as loadingIndicator from "./loading-indicator";
import { ClientPrefetchMixin, installRouterHooks, prefetchComponents } from "./client-prefetch";

interface SSRGlobalVariables {
	__INITIAL_STATE__: any;
}

declare const window: Window & SSRGlobalVariables;

useServiceWorker();

Vue.mixin(ClientPrefetchMixin);

const { vue, router, store } = createApp(window.__INITIAL_STATE__);

function init() {

	// 这俩要放在挂载的前面，因为它们影响关键的元素
	mediaQueryPlugin.observeWindow(store);
	SUN_PHASES.observe().subscribe(value => store.commit(SET_SUN_PHASE, value));

	vue.$mount("#app");
	loadingIndicator.mount();

	installRouterHooks(store, router);

	// 切换视图后关掉所有弹窗
	router.afterEach((vue as any).$dialog.clear);
}

/*
 * 如果有 window.__INITIAL_STATE__ 全局属性则说明使用了服务端渲染。
 *
 * 在服务端渲染下，将初始化注册到 router.onReady() 上，使其在初始
 * 路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
 */
if (window.__INITIAL_STATE__) {
	router.onReady(init);
	delete window.__INITIAL_STATE__;
} else {
	prefetchComponents(store, router.currentRoute, router.getMatchedComponents(), init);
	store.dispatch(REFRESH_USER); // AppShell 模式不会在服务端加载用户
}
