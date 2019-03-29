import createApp from "./main";
import { CancelToken } from "kx-ui";
import Vue from "vue";
import { REFRESH_USER } from "./store/types";


function onReadyAsync (router) {
	return new Promise((resolve, reject) => router.onReady(resolve, reject));
}

export default async context => {
	if (context.shellOnly || /^\/edit\//.test(context.url)) {
		return new Vue({ render: h => h("div", { attrs: { id: "app" } }) });
	}
	const { vue, router, store } = createApp();

	router.push(context.url);
	await onReadyAsync(router);

	const matched = router.getMatchedComponents();
	if (!matched.length) {
		router.push("/error/" + 404);
	}

	// 对所有匹配的路由组件调用 `asyncData()`
	const tasks = matched.filter(c => c.asyncData).map(c => c.asyncData({
		store,
		route: router.currentRoute,
		cancelToken: CancelToken.NEVER,
		prototype: context.request,
		isServer: true,
	}));

	// 因为全站都是预渲染，所以初始用户在后台加载一次即可
	tasks.push(store.dispatch(REFRESH_USER, context.request));

	try {
		await Promise.all(tasks);
	} catch (e) {
		switch (e.code) {
			case 404:
			case 410:
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
