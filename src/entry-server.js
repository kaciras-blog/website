import createApp from './main';

export default context => new Promise((resolve, reject) => {
	const { vue, router, store } = createApp();

	router.push(context.url);

	router.onReady(() => {
		const matchedComponents = router.getMatchedComponents();
		if (!matchedComponents.length) {
			return reject({ code: 404 });
		}

		// 对所有匹配的路由组件调用 `asyncData()`
		Promise.all(matchedComponents.map(component => {
			if (component.asyncData) {
				return component.asyncData({ store, route: router.currentRoute });
			}
		})).then(() => {
			context.state = store.state;
			resolve(vue);
		}).catch(reject);
	}, reject);

});

