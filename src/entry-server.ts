import Vue from "vue";
import { Store } from "vuex";
import { Route, VueRouter } from "vue-router/types/router";
import { CancellationToken } from "@kaciras-blog/uikit";
import { SET_WIDTH } from "@kaciras-blog/uikit/src/media-query/index";
import { configureForProxy } from "@kaciras-blog/server/lib/axios-helper";
import { RenderContext } from "@kaciras-blog/server/lib/koa/vue-ssr";
import api, { Api } from "./api";
import { PrefetchContext } from "./prefetch";
import { REFRESH_USER, SET_PREFETCH_DATA } from "./store/types";
import createApp, { mediaBreakpoints } from "./main";


class ServerPrefetchContext extends PrefetchContext {

	readonly store: Store<any>;
	readonly route: Route;
	readonly api: Api;

	constructor(store: Store<any>, route: Route, api: Api) {
		super();
		this.store = store;
		this.route = route;
		this.api = api;
	}

	get isServer() {
		return true;
	}

	get cancelToken() {
		return CancellationToken.NEVER;
	}
}

/**
 * 等待路由准备好，都什么时代了 vue-router 还在用回调式的API。
 *
 * @param router Vue的路由
 * @return 在路由准备好了之后resolve
 */
function onReadyAsync(router: VueRouter) {
	return new Promise<void>((resolve, reject) => router.onReady(resolve, reject));
}

/**
 * 简单地通过 User-Agent 判断客户端的设备是不是手机
 *
 * @param userAgent User-Agent
 * @return 如果是手机返回true，否则false
 */
function isMobile(userAgent: string) {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export default async (context: RenderContext) => {
	const { request, url } = context;

	if (/^\/edit\//.test(url.pathname)) {
		return new Vue({ render: h => h("div", { attrs: { id: "app" } }) });
	}

	const { vue, router, store } = createApp();
	const ssrApi = api.withConfigProcessor(config => configureForProxy(request, config));

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度
	const userAgent = request && request.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		store.commit(SET_WIDTH, mediaBreakpoints.mobile);
	}

	// 因为全站都是预渲染，所以初始用户在服务端加载一次即可。
	// 控制台配置了拦截，必须先登陆，否则后面的路由直接跳到错误页
	const userCheckNeeded = /^\/console\/?/.test(url.pathname);
	if (userCheckNeeded) {
		await store.dispatch(REFRESH_USER, ssrApi);
	}

	router.push(url.pathname);
	await onReadyAsync(router);
	const session = new ServerPrefetchContext(store, router.currentRoute, ssrApi);

	/*
	 * 路由配置里最后一条把所有未匹配的路由都转到错误页，
	 * 故 router.getMatchedComponents() 不会返回空数组，也无法用其区分404.
	 * 目前的方案是在 ErrorPage.vue 里设置一个标识表示 NotFound.
	 */
	const componentTasks = (router.getMatchedComponents() as any[])
		.filter(c => c.asyncData)
		.map(c => c.asyncData(session));

	if (!userCheckNeeded) {
		componentTasks.push(store.dispatch(REFRESH_USER, ssrApi));
	}

	try {
		await Promise.all(componentTasks);
		store.commit(SET_PREFETCH_DATA, session.data);
	} catch (e) {
		switch (e.code) {
			case 404:
			case 410:
			case 429:
				router.push("/error/" + e.code);
				break;
			default:
				throw e;
		}
	}

	const { title } = router.currentRoute.meta;
	if (title) {
		context.title = title + " - Kaciras的博客";
		context.meta = "<meta name='description' content='欢迎来到Kaciras的博客'>";
	}

	// Vue2的类型定义......
	(context as any).state = store.state;

	return vue;
};
