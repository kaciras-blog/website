import createApp from "./main";
import { CancelToken } from "kx-ui";
import Vue from "vue";
import { REFRESH_USER, SET_PREFETCH_DATA } from "./store/types";
import { SET_SCREEN_WIDTH, DEFAULT_QUERIES } from "kx-ui/src/media-query/index";


class ServerPrefetchContext {

	constructor(store, route, request) {
		this.store = store;
		this.route = route;
		this.request = request;
		this.data = {};
	}

	get cancelToken() {
		return CancelToken.NEVER;
	}

	get isServer() {
		return true;
	}

	dataSetter(name) {
		return value => this.data[name] = value;
	}
}

function onReadyAsync(router) {
	return new Promise((resolve, reject) => router.onReady(resolve, reject));
}

function isMobile(userAgent) {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export default async context => {
	if (context.shellOnly || /^\/edit\//.test(context.url)) {
		return new Vue({ render: h => h("div", { attrs: { id: "app" } }) });
	}
	const { vue, router, store } = createApp();
	const vuexTasks = [];

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度
	const userAgent = context.request.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		store.commit(SET_SCREEN_WIDTH, DEFAULT_QUERIES.mobile);
	}

	// 因为全站都是预渲染，所以初始用户在服务端加载一次即可。
	// 控制台配置了拦截，必须先登陆，否则后面的路由直接跳到错误页
	if (/^\/console\/?/.test(context.url)) {
		await store.dispatch(REFRESH_USER, context.request);
	} else {
		vuexTasks.push(store.dispatch(REFRESH_USER, context.request));
	}

	router.push(context.url);
	await onReadyAsync(router);

	const matched = router.getMatchedComponents();
	if (!matched.length) {
		router.push("/error/" + 404);
	}

	const session = new ServerPrefetchContext(store, router.currentRoute, context.request);
	const componentTasks = matched
		.filter(c => c.asyncData)
		.map(c => c.asyncData(session));

	try {
		await Promise.all(vuexTasks.concat(componentTasks));
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

	const title = router.currentRoute.meta.title;
	if (title) {
		context.title = title + " - Kaciras的博客";
		context.meta = "<meta name='description' content='Kaciras个人博客'>";
	}

	context.state = store.state;
	return vue;
};
