import createApp from "./main";
import Vue from "vue";
import TransitionsCurtain from "./components/TransitionCurtain2";
import { CancelToken } from "kx-ui";


/* 生产模式下注册 ServiceWorker，开发模式禁用 */
if("serviceWorker" in navigator) {
	if (process.env.NODE_ENV === "production") {
		navigator.serviceWorker.register("/sw.js")
			.then(() => console.log("Service worker registered successfully."))
			.catch(() => console.error("Service worker failed to register."));
	} else {
		navigator.serviceWorker.getRegistrations()
			.then(regs => regs.forEach(reg => reg.unregister()))
			.catch(() => console.error("Service worker failed to unregister."));
	}
}

// =================================== Client Data Prefetch ===================================

let cancelToken = CancelToken.NEVER;

const curtain = new Vue(TransitionsCurtain).$mount();
document.body.appendChild(curtain.$el);


/** 取消上一个 CancelToken，然后初始化一个新的 */
function initializeCancelToken() {
	cancelToken.cancel();
	cancelToken = CancelToken.timeout(10_000);
	cancelToken.onCancel(() => curtain.error());
}

/**
 * 处理预加载任务，包括显示加载指示器、错误页面、防止取消后跳转等。
 *
 * @param task {Promise | Promise[]} 预加载任务
 * @param next 路由函数
 */
function prefetch(task, next) {
	if (Array.isArray(task)) {
		task = Promise.all(task);
	}
	curtain.middle();
	task.then(() => !cancelToken.isCancelled && next())
		.then(() => curtain.finish())
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
	curtain.error();
}

// mixin 必须在创建 Vue 实例之前
Vue.mixin({
	beforeRouteUpdate(to, from, next) {
		if (!this.$options.asyncData) {
			return next();
		}
		initializeCancelToken();
		const task = this.$options.asyncData({ store: this.$store, route: to, isServer: false, cancelToken });
		prefetch(task, next);
	},
});

const { vue, router, store } = createApp();


/**
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.检测组件的 prefetch 属性，使其能够在客户端不进行预加载。
 *   3.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 *   4.允许用户取消正在进行的预加载，并中止网络请求（需要预加载函数支持）。
 */
function initAppAndRouterHook() {

	// 切换视图后应该关掉所有弹窗
	router.afterEach(() => vue.$dialog.clear());

	/*
	 * 在异步组件解析前就显示加载指示器。
	 * 异步组件getMatchedComponents()返回一个函数，加载完成的组件则返回对象。
	 */
	router.beforeEach((to, from, next) => {
		next();
		const matched = router.getMatchedComponents(to);
		if (matched.filter(c => typeof c === "function").length) {
			curtain.start(); // 未加载过的异步组件是函数，此时激活指示器
		}
		initializeCancelToken();
	});

	/*
	 * 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
	 */
	router.beforeResolve((to, from, next) => {
		if (cancelToken.isCancelled) {
			return next(); // 异步组件加载时取消
		}

		// （这段是官网给的）我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件。
		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);
		let diffed = false;
		const activated = matched.filter((c, i) => diffed || (diffed = (previous[i] !== c)));

		if (!activated.length) {
			return next();
		}
		if (to.meta.title) {
			document.title = to.meta.title + " - Kaciras的博客";
		}
		const tasks = activated.filter(c => c.asyncData)
			.map(c => c.asyncData({ store, route: to, cancelToken, isServer: false }));

		prefetch(tasks, next);
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
	store.replaceState(window.__INITIAL_STATE__);
	delete window.__INITIAL_STATE__;
	router.onReady(initAppAndRouterHook);
} else {
	initAppAndRouterHook(); // 非服务端渲染，直接初始化
}
