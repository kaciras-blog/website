import createApp from "./main";
import Vue from "vue";
import TransitionsCurtain from "./components/common/TransitionCurtain";
import { REFRESH_USER } from "./store/types";
import axios from "axios";

/*
 * 注册 ServiceWorker 提升加载速度。
 */
// if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
// 	navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
// 		.then(() => console.log("Service worker registered successfully!"))
// 		.catch(() => console.error("Service worker failed to register!"));
// }

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

store.dispatch(REFRESH_USER)
	.catch((e) => console.error("无法连接账号服务器", e)); // 异步加载用户信息


class CancelToken {

	constructor() {
		this.canceled = false;
		this.callbacks = [];
	}

	cancel() {
		this.canceled = true;
		this.callbacks.forEach(cb => cb());
	}

	onCancel(callback) {
		this.callbacks.push(callback);
	}
}

/**
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 *   1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 *   2.检测组件的 prefetch 属性，使其能够在客户端不进行预加载。
 *   3.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 *   4.导航取消，允许用户取消正在进行的导航，并中止网络请求。
 */
function initAppAndRouterHook() {

	let cancelToken = new CancelToken();

	curtain.$on("canceled", () => cancelToken.cancel());

	async function prefetch(to, from, next) {
		if(cancelToken.canceled) return;

		const matched = router.getMatchedComponents(to);
		const previous = router.getMatchedComponents(from);

		// 我们只关心非预渲染的组件
		// 所以我们对比它们，找出两个匹配列表的差异组件
		let diffed = false;
		const activated = matched.filter((c, i) => {
			return diffed || (diffed = (previous[i] !== c));
		});
		if (!activated.length) return next();

		// 找出所有需要预加载的组件
		const prefetched = activated.filter(c => c.asyncData && c.prefetch);
		if (!prefetched.length) return next();

		curtain.start();
		await Promise.all(prefetched.map(c => c.asyncData({ store, route: to, cancelToken })));
		next();
	}

	/*
	 * 在异步组件解析前就显示加载指示器。
	 * 异步组件getMatchedComponents()返回一个函数，加载完成的组件则返回对象。
	 */
	router.beforeEach((to, from, next) => {
		const matched = router.getMatchedComponents(to);
		if (matched.filter(c => typeof c === "function").length) {
			curtain.start();
		}
		cancelToken = new CancelToken();
		next();
	});

	/*
	 * 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
	 */
	router.beforeResolve((to, from, next) => {
		prefetch(to, from, next)
			.catch(err => handleError(err, next))
			.finally(() => curtain.finish());
	});

	vue.$mount("#app");
}

function handleError(err, next) {
	if(err instanceof axios.Cancel) {
		return;
	}
	switch (err.code) {
		case 301:
		case 302:
			next(err.location);
			break;
		default:
			console.error(err);
			return next("/error/500");
	}
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
