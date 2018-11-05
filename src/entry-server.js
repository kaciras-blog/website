import createApp from "./main";
import { CancelToken } from "kx-ui";


function onReadyAsync (router) {
	return new Promise((resolve, reject) => router.onReady(resolve, reject));
}

export default async context => {
	const { vue, router, store } = createApp();

	router.push(context.request.url);
	await onReadyAsync(router);

	const matched = router.getMatchedComponents();
	if (!matched.length) {
		throw { code: 404 };
	}

	// 对所有匹配的路由组件调用 `asyncData()`
	await Promise.all(matched
		.filter(c => c.asyncData)
		.map(c => c.asyncData({
			store,
			route: router.currentRoute,
			cancelToken: CancelToken.never(),
			protorype: context.request,
		})));

	const title = router.currentRoute.meta.title;
	if (title) {
		context.title = title + " - Kaciras的博客";
	}

	context.state = store.state;
	return vue;
};

