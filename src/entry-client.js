import createApp from "./main";
import Vue from "vue";
import { CancelToken } from "kx-ui";
import * as loadingIndicator from "./loading-indicator";
import { SET_PREFETCH_DATA } from "./store/types";


/* 生产模式下注册 ServiceWorker，开发模式禁用 */
if ("serviceWorker" in navigator) {
	if (process.env.NODE_ENV === "production") {
		navigator.serviceWorker.register("/sw.js")
			.then(() => console.log("Service worker registered successfully."))
			.catch((err) => console.error("Service worker failed to register:", err));
	} else {
		navigator.serviceWorker.getRegistrations()
			.then(regs => regs.forEach(reg => reg.unregister()))
			.catch(() => console.error("Service worker failed to unregister."));
	}
}

// =================================== Client Data Prefetch ===================================

let cancelToken = CancelToken.NEVER;


/**
 * 处理预加载任务，包括显示加载指示器、错误页面、防止取消后跳转等。
 *
 * @param session 预加载会话
 * @param task {Promise | Promise[] | undefined} 预加载任务
 * @param next 路由函数
 */
function prefetch(session, task, next) {
	if (!task) {
		task = Promise.resolve();
	} else if (Array.isArray(task)) {
		task = Promise.all(task);
	}

	loadingIndicator.setComponentResolved();

	task.then(() => {
			if (!cancelToken.isCancelled) {
				next();
				store.commit(SET_PREFETCH_DATA, session.data);
			}
			loadingIndicator.setSuccessful();
		})
		.catch(err => handleError(err, next));
}

function handleError(err, next) {
	if (cancelToken.isCancelled) {
		return;
	}
	switch (err.code) {
		case -1:
			break;
		case 301:
		case 302:
			next(err.location);
			break;
		case 404:
		case 410:
			next({ path: "/error/" + err.code, replace: true });
			break;
		default:
			console.error(err);
			next("/error/500");
			break;
	}
	loadingIndicator.setError();
}

class ClientPrefetchContext {

	constructor(route, cancelToken) {
		this.route = route;
		this.cancelToken = cancelToken;
		this.data = {};
	}

	get store() {
		return store;
	}

	get isServer() {
		return false;
	}

	dataSetter(name) {
		return value => this.data[name] = value;
	}
}

// mixin 必须在创建 Vue 实例之前
Vue.mixin({
	beforeRouteUpdate(to, from, next) {
		if (!this.$options.asyncData) {
			return next();
		}
		const ctx = new ClientPrefetchContext(to, loadingIndicator.start());
		const task = this.$options.asyncData(ctx);
		prefetch(ctx, task, next);
	},
});

const { vue, router, store } = createApp(window.__INITIAL_STATE__);


/**
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 *   3.允许用户取消正在进行的预加载，并中止网络请求（需要预加载函数支持）。
 */
function initAppAndRouterHook() {

	// 切换视图后应该关掉所有弹窗
	router.afterEach(() => vue.$dialog.clear());

	// 在异步组件解析前就显示加载指示器
	router.beforeEach((to, from, next) => {
		next();
		cancelToken = loadingIndicator.start();
	});

	// 使用 router.beforeResolve()，以便确保所有异步组件都 resolve。
	router.beforeResolve((to, from, next) => {
		if (cancelToken.isCancelled) return;

		// （这段是官网给的）我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件。
		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);
		let diffed = false;
		const activated = matched.filter((c, i) => diffed || (diffed = (previous[i] !== c)));
		if (!activated.length) return;

		const ctx = new ClientPrefetchContext(to, cancelToken);
		const tasks = activated
			.filter(c => c.asyncData)
			.map(c => c.asyncData(ctx));

		const nextWrapper = (...args) => {
			if (to.meta.title) {
				document.title = to.meta.title + " - Kaciras的博客";
			}
			next(...args);
		};
		prefetch(ctx, tasks, nextWrapper);
	});

	vue.$mount("#app");
}


/*
 * 检测并替换服务端渲染的状态，并添加路由钩子函数，用于处理 asyncData.
 *
 * 在服务端渲染下，将初始化注册到 router.onReady() 上，使其在初始
 * 路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
 */
if (window.__INITIAL_STATE__) {
	router.onReady(initAppAndRouterHook);
	delete window.__INITIAL_STATE__;
} else {
	initAppAndRouterHook(); // 非服务端渲染，直接初始化
}
