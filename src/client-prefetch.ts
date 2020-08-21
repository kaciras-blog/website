/*
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 *   3.允许取消正在进行的预加载，并中止网络请求（需要预加载函数支持）。
 */
import Vue, { ComponentOptions } from "vue";
import { Route } from "vue-router";
import { NavigationGuardNext, VueRouter } from "vue-router/types/router";
import { Store } from "vuex";
import { CancellationToken } from "@kaciras-blog/uikit";
import api from "@/api";
import { SET_PREFETCH_DATA } from "@/store/types";
import { isOnlyHashChange } from "./utils";
import { MaybePrefetchComponent, PrefetchContext } from "./prefetch";
import * as loadingIndicator from "./loading-indicator";

let cancelToken = CancellationToken.NEVER;

// @ts-ignore api & isServer on prototype.
class ClientPrefetchContext extends PrefetchContext {

	readonly store: Store<any>;
	readonly cancelToken: CancellationToken;
	readonly route: Route;

	constructor(store: Store<any>, route: Route, cancelToken: CancellationToken) {
		super();
		this.store = store;
		this.route = route;
		this.cancelToken = cancelToken;
	}
}

ClientPrefetchContext.prototype.api = api;
ClientPrefetchContext.prototype.isServer = false;

/**
 * 预载下一个路由的组件数据，并更新页面标题等属性。
 *
 * @param store Vuex存储实例
 * @param to 即将要进入的目标路由对象
 * @param components 需要预载数据的组件数组
 * @param next 进行管道中的下一个钩子
 */
export function prefetch(
	store: Store<any>,
	to: Route,
	components: MaybePrefetchComponent[],
	next: NavigationGuardNext) {

	if (components.length === 0) {
		return next();
	}

	function nextWrapper(...args: any[]) {
		const { title } = to.meta;
		if (title) {
			document.title = title + " - Kaciras的博客";
		}
		return next(...args);
	}

	return doPrefetch(store, to, components, nextWrapper);
}

/**
 * 处理预加载任务，包括显示加载指示器、错误页面、防止取消后跳转等。
 */
function doPrefetch(
	store: Store<any>,
	to: Route,
	components: MaybePrefetchComponent[],
	next: NavigationGuardNext) {

	loadingIndicator.startPrefetch();
	const context = new ClientPrefetchContext(store, to, cancelToken);

	const tasks = components.filter(c => c.asyncData).map(c => c.asyncData!(context));

	return Promise.all(tasks).then(() => {
		if (cancelToken.isCancelled) {
			next(false);
			console.debug(`导航被取消：${to.path}`);
		} else {
			store.commit(SET_PREFETCH_DATA, context.data);
			next();
		}
		loadingIndicator.finishSuccessful();
	}).catch((err) => {
		if (cancelToken.isCancelled) {
			next(false);
			return console.debug(`导航被取消：${to.path}`);
		}

		switch (err.code) {
			case -1:
				break;
			case 301:
			case 302:
				loadingIndicator.finishSuccessful();
				return next(err.location);
			case 404:
			case 410:
				next({ path: "/error/" + err.code, replace: true });
				break;
			default:
				console.error(err);
				next("/error/500");
		}

		loadingIndicator.finishWithError();
	});
}

/**
 * mixin 必须在创建 Vue 实例之前
 */
export const ClientPrefetchMixin: ComponentOptions<Vue> = {
	beforeRouteUpdate(this: Vue, to, from, next) {
		if (!(this.$options as any).asyncData) {
			return next();
		}
		cancelToken = loadingIndicator.start();
		prefetch(this.$store, to, [this.$options], next);
	},
}

export function installRouterHooks(store: Store<any>, router: VueRouter) {

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
			console.debug(`导航被取消：${to.path}`);
			return next(false);
		}

		// （这段是官网给的）我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件。
		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);
		let diffed = false;
		const activated = matched.filter((c, i) => diffed || (diffed = (previous[i] !== c)));

		prefetch(store, to, (activated as MaybePrefetchComponent[]), next);
	});
}
