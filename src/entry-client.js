import "./error-report";
import "./analytics";
import createApp, { mediaQueryPlugin } from "./main";
import Vue from "vue";
import { CancellationToken } from "@kaciras-blog/uikit";
import * as loadingIndicator from "./loading-indicator";
import { REFRESH_USER, SET_PREFETCH_DATA, SET_SUN_PHASE } from "./store/types";
import "./serviceWorker";
import { SUN_PHASES } from "@/store";


let cancelToken = CancellationToken.NEVER;

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

	loadingIndicator.componentResolved();

	task.then(() => {
		if (!cancelToken.isCancelled) {
			next();
			store.commit(SET_PREFETCH_DATA, session.data);
		} else {
			next(false);
		}
		loadingIndicator.setSuccessful();
	})
		.catch(err => handleError(err, next));
}

function handleError(err, next) {
	if (cancelToken.isCancelled) {
		return next(false);
	}
	switch (err.code) {
		case -1:
			break;
		case 301:
		case 302:
			loadingIndicator.setSuccessful();
			return next(err.location);
		case 404:
		case 410:
			next({ path: "/error/" + err.code, replace: true });
			break;
		default:
			console.error(err);
			next("/error/500");
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
		cancelToken = loadingIndicator.start();
		const ctx = new ClientPrefetchContext(to, cancelToken);
		prefetch(ctx, this.$options.asyncData(ctx), next);
	},
});

const { vue, router, store } = createApp();

/**
 * 检查两个路由是否仅仅是 HASH 不同而 URL 的其它部分是一样的。
 *
 * @param to 路由记录
 * @param from 路由记录
 * @return {boolean} 两个路由除了HASH部分外是否一样
 */
function isOnlyHashChange(to, from) {
	const fPath = from.fullPath, tPath = to.fullPath;
	const i = fPath.indexOf("#"), j = tPath.indexOf("#");
	const fp = i < 0 ? fPath : fPath.substring(0, i);
	const tp = j < 0 ? tPath : tPath.substring(0, j);
	return fp === tp;
}

/**
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 *   3.允许取消正在进行的预加载，并中止网络请求（需要预加载函数支持）。
 */
function initAppAndRouterHook() {

	// 切换视图后应该关掉所有弹窗
	router.afterEach(vue.$dialog.clear);

	/**
	 * 相比于官网示例，这里把加载指示器提前到 beforeEach 钩子，以便在异步组件下载前就开始加载提示。
	 *
	 * 另外，文章页面有 Markdown 生成的标题跳转链接，这些链接都是页内跳转不需要走预加载流程，所以
	 * 这里检查下是否仅 HASH 变化，如果是则跳过预载流程。
	 *
	 * 在 isOnlyHashChange 为 true 时，应当直接返回而不是 return next(false)，否则浏览器URL不会改变。
	 */
	router.beforeEach((to, from, next) => {
		if (isOnlyHashChange(to, from)) {
			return;
		}
		cancelToken = loadingIndicator.start();
		return next();
	});

	// 使用 router.beforeResolve()，以便确保所有异步组件都 resolve。
	router.beforeResolve((to, from, next) => {
		if (cancelToken.isCancelled) {
			return next(false);
		}

		// （这段是官网给的）我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件。
		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);
		let diffed = false;
		const activated = matched.filter((c, i) => diffed || (diffed = (previous[i] !== c)));

		const nextWrapper = (...args) => {
			if (to.meta.title) {
				document.title = to.meta.title + " - Kaciras的博客";
			}
			next(...args);
		};

		if (!activated.length) {
			return nextWrapper();
		}

		const session = new ClientPrefetchContext(to, cancelToken);
		const tasks = activated
			.filter(c => c.asyncData)
			.map(c => c.asyncData(session));

		prefetch(session, tasks, nextWrapper);
	});

	// AppShell 模式不会在服务端加载用户
	if (typeof store.state.user === "undefined") {
		store.dispatch(REFRESH_USER);
	}

	mediaQueryPlugin.observeWindow(store);
	SUN_PHASES.observe().subscribe(value => store.commit(SET_SUN_PHASE, value));

	vue.$mount("#app");
}

/*
 * 如果有 window.__INITIAL_STATE__ 全局属性则说明使用了服务端渲染。
 *
 * 在服务端渲染下，将初始化注册到 router.onReady() 上，使其在初始
 * 路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
 */
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
	delete window.__INITIAL_STATE__;
	router.onReady(initAppAndRouterHook);
} else {
	initAppAndRouterHook(); // 没有经过服务端渲染，就直接初始化。
}
