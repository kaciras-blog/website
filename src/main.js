import "./css/Main.less";
import Vue from "vue";
import createRouter from "./router";
import createStore from "./store";
import App from "./App";

import { MediaQueryManager } from "kx-ui/src/media-query";
import KxUI from "kx-ui";
import KxMarkdown from "./markdown";
import BlogPlugin from "./blog-plugin";
import Croppa from "vue-croppa";
import VueMultiselect from "vue-multiselect";

Vue.config.productionTip = false;

Vue.use(Croppa);
Vue.use(KxUI);
Vue.use(KxMarkdown);
Vue.use(BlogPlugin);

export const mediaBreakpoints = {
	mobile: 768,
	tablet: 992,
	desktop: 1200,
	wide: 99999,
};
export const mediaQueryPlugin = new MediaQueryManager(mediaBreakpoints);
Vue.use(mediaQueryPlugin);

Vue.component(VueMultiselect.name, VueMultiselect);

/**
 * 服务端和客户端公共的初始化逻辑。
 *
 * 由于创建Vue实例后就立即渲染，而此时可能就需要初始状态（比如控制台页面鉴权），所以不能等到创建之后再
 * 替换服务端渲染出的初始状态，而要在创建Vue实例之前就调用 store.replaceState(...)
 *
 * @param initState Vuex的初始状态
 * @return {*} Vue全家桶
 */
export default function createApp(initState = undefined) {
	const store = createStore();
	const router = createRouter();

	mediaQueryPlugin.registerToStore(store);
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

		beforeEnter(to, from, next) {
			const { user } = store.state;
			if (user && user.id === 2)
				next();
			else
				next({ path: "/login", query: { return_uri: "/console" } });
		},
	};
	router.addRoutes([consoleRoute]);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
