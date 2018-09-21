import createApp from "./main";
import Vue from "vue";
import TransitionsCurtain from "./components/common/TransitionCurtain";

const curtain = new Vue(TransitionsCurtain).$mount();
document.body.appendChild(curtain.$el);

Vue.mixin({
	beforeRouteUpdate(to, from, next) {
		const { asyncData } = this.$options;
		if (asyncData) {
			asyncData({ store: this.$store, route: to }).then(next).catch(console.error);
		} else {
			next();
		}
	},
});

const { vue, router, store } = createApp();

/**
 * 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
 */
function initAppAndRouterHook() {
	router.beforeResolve((to, from, next) => {
		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);

		// 我们只关心非预渲染的组件
		// 所以我们对比它们，找出两个匹配列表的差异组件
		let diffed = false;
		const activated = matched.filter((c, i) => {
			return diffed || (diffed = (previous[i] !== c));
		});

		if (!activated.length) {
			return next();
		}

		curtain.start(); // 这里如果有加载指示器(loading indicator)，就触发
		Promise.all(activated.filter(c => c.asyncData).map(c => c.asyncData({ store, route: to })))
			.then(next).catch(err => {
				next();
				console.error(err);
			}).finally(curtain.finish);// 停止加载指示器(loading indicator)
	});

	vue.$mount('#app');
}

/*
 * 检测并替换服务端渲染的状态，并添加路由钩子函数，用于处理 asyncData.
 *
 * 在服务端渲染下，将初始化注册到 router.onReady() 上，使其在初始
 * 路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
 */
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
	router.onReady(initAppAndRouterHook);
} else {
	initAppAndRouterHook(); // 非服务端渲染，直接初始化
}
