import createApp from "./main";
import { CancelToken } from "kx-ui";
import Vue from "vue";


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
	try {
		await Promise.all(matched
			.filter(c => c.asyncData)
			.map(c => c.asyncData({
				store,
				route: router.currentRoute,
				cancelToken: CancelToken.NEVER,
				prototype: context.request,
			})));
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
