import { createApp, h } from "vue";
import { Store } from "vuex";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { SET_WIDTH } from "@kaciras-blog/uikit";
import { configureForProxy } from "@kaciras-blog/server/lib/axios-helper";
import { RenderContext } from "@kaciras-blog/server/lib/koa/vue-ssr";
import api, { Api } from "./api";
import { PrefetchContext } from "./prefetch";
import { REFRESH_USER, SET_PREFETCH_DATA } from "./store/types";
import createBlogApp, { mediaBreakpoints } from "./main";

/*
 *
 */

// @ts-ignore isServer on prototype.
class ServerPrefetchContext extends PrefetchContext {

	readonly store: Store<any>;
	readonly route: RouteLocationNormalizedLoaded;
	readonly api: Api;
	readonly signal: AbortSignal;

	constructor(
		store: Store<any>,
		route: RouteLocationNormalizedLoaded,
		api: Api,
		signal: AbortSignal,
	) {
		super();
		this.store = store;
		this.route = route;
		this.api = api;
		this.signal = signal;
	}
}

ServerPrefetchContext.prototype.isServer = true;

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
		return createApp({ render: () => h("div", { id: "app" }) });
	}

	const { app, router, store } = createBlogApp();
	const ssrApi = api.withConfigProcessor(config => configureForProxy(request, config));

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度
	const userAgent = request?.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		store.commit(SET_WIDTH, mediaBreakpoints.mobile);
	}

	// 因为全站都是预渲染，所以初始用户在服务端加载一次即可。
	// 控制台配置了拦截，必须先登陆，否则后面的路由直接跳到错误页
	const userCheckNeeded = /^\/console\/?/.test(url.pathname);
	if (userCheckNeeded) {
		await store.dispatch(REFRESH_USER, ssrApi);
	}

	// router.push 返回的 Promise 等待所有 hooks 都调用完毕
	router.push(url.pathname);
	await router.isReady();

	const route = router.currentRoute.value;
	const controller = new AbortController();
	const session = new ServerPrefetchContext(store, route, ssrApi, controller.signal);

	/*
	 * 路由配置里最后一条把所有未匹配的路由都转到错误页，
	 * 故 router.getMatchedComponents() 不会返回空数组，也无法用其区分404.
	 * 目前的方案是在 error/Index.vue 里设置一个标识表示 NotFound.
	 */
	const tasks = route.matched
		.flatMap(v => Object.values(v.components) as any)
		.filter(c => c.loadData)
		.map(c => c.loadData(session));

	if (!userCheckNeeded) {
		tasks.push(store.dispatch(REFRESH_USER, ssrApi));
	}

	try {
		await Promise.all(tasks);
		store.commit(SET_PREFETCH_DATA, session.data);
	} catch (e) {
		controller.abort();

		switch (e.code) {
			case 404:
			case 410:
			case 429:
				await router.push("/error/" + e.code);
				break;
			default:
				throw e;
		}
	}

	const { title } = route.meta;
	if (title) {
		context.title = title + " - Kaciras的博客";
		context.meta = "<meta name='description' content='欢迎来到Kaciras的博客'>";
	}


	// Vue2 的类型定义......
	(context as any).state = store.state;

	return app;
};
