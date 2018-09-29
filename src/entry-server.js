import createApp from "./main";

function onReadyAsync(router) {
	return new Promise((resolve, reject) => router.onReady(resolve, reject));
}

export default async context => {
	const { vue, router, store } = createApp();

	router.push(context.url);
	await onReadyAsync(router);

	const matched = router.getMatchedComponents();
	if (!matched.length) {
		throw { code: 404 };
	}

	// 对所有匹配的路由组件调用 `asyncData()`
	await Promise.all(matched
		.filter(c => c.asyncData)
		.map(c => c.asyncData({ store, route: router.currentRoute })));

	context.state = store.state;
	return vue;
};

