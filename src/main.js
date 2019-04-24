import "./css/Main.less";
import Vue from "vue";
import createRouter from "./router";
import createStore from "./store";
import App from "./App";

import { MediaQueryPlugin, registerToStore } from "./store/media-query";
import KxUI from "kx-ui";
import KxMarkdown from "./markdown";
import BlogPlugin from "./blog-plugin";
import Croppa from "vue-croppa";

Vue.config.productionTip = false;

Vue.use(KxUI);
Vue.use(KxMarkdown);
Vue.use(BlogPlugin);
Vue.use(Croppa);
Vue.use(MediaQueryPlugin);

/**
 * 服务端和客户端公共的初始化逻辑。
 *
 * 由于创建Vue实例后就立即渲染，而此时可能就需要初始状态（比如控制台页面鉴权），所以不能等到创建之后再
 * 替换服务端渲染出的初始状态，而要在创建Vue实例之前就调用 store.replaceState(...)
 *
 * @param initState Vuex的初始状态
 * @return Vue全家桶
 */
export default function createApp(initState = undefined) {
	const store = createStore();
	const router = createRouter();

	registerToStore(store);
	if (initState) {
		store.replaceState(initState);
	}

	/*
	 * 阻止未登录用户访问后台页面。
	 * router.app.$store获取不到store实例，所以就放在这了
	 */
	const consoleRoute = {
		path: "/console",
		component: () => import("./views/console/ConsolePage"),
		meta: { title: "控制台" },
	};
	consoleRoute.beforeEnter = (to, from, next) => {
		const user = store.state.user;
		if (user && user.id === 2)
			return next();
		next({ path: "/error/404", replace: true });
	};
	router.addRoutes([consoleRoute]);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
