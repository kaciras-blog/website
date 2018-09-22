import createApp from "./main";
import Vue from "vue";
import TransitionsCurtain from "./components/common/TransitionCurtain";

/*
 * 注册 ServiceWorker 提升加载速度。
 */
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
		.then(() => console.log("Service worker registered successfully!"))
		.catch(() => console.error("Service worker failed to register!"));
}

const curtain = new Vue(TransitionsCurtain).$mount();
document.body.appendChild(curtain.$el);

Vue.mixin({
	beforeRouteUpdate(to, from, next) {
		const { asyncData } = this.$options;
		if (asyncData) {
			asyncData({ store: this.$store, route: to })
				.then(next)
				.catch(console.error);
		} else {
			next();
		}
	},
});

const { vue, router, store } = createApp();

/**
 * 在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.检测组件的 prefetch 属性，使其能够在客户端不进行预加载。
 */
function initAppAndRouterHook() {

	/**
	 * 在异步组件解析前就显示加载指示器。
	 * 异步组件getMatchedComponents()返回一个函数，加载完成的组件则返回对象。
	 */
	router.beforeEach((to, from, next) => {
		const matched = router.getMatchedComponents(to);
		if (matched.filter(c => typeof c === "function").length) {
			curtain.start();
		}
		next();
	});

	/**
	 * 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
	 */
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

		const prefetched = activated.filter(c => c.asyncData);
		if (!prefetched.length) {
			curtain.finish(); // 别忘了关掉加载指示器，它可能由异步组件加载开启
			return next();
		}

		curtain.start();
		Promise.all(prefetched.map(c => c.asyncData({ store, route: to })))
			.then(next)
			.catch(next)
			.finally(curtain.finish);
	});

	vue.$mount("#app");
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
