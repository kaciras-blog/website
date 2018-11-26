import "./css/Main.less";
import Vue from "vue";
import createRouter from "./router";
import createStore from "./store";

import KxUI from "kx-ui";
import KxMarkdown from "./markdown";
import BlogPlugin from "./blog-plugin";


Vue.config.productionTip = false;

Vue.use(KxUI);
Vue.use(KxMarkdown);
Vue.use(BlogPlugin);


export default function () {
	const store = createStore();
	const router = createRouter();

	/*
	 * 阻止未登录用户访问后台页面。
	 * router.app.$store获取不到store实例，所以就放在这了
	 */
	const coneoleRoute = {
		path: "/console",
		component: () => import("./views/console/ConsolePage"),
		meta: { title: "控制台" },
	};
	coneoleRoute.beforeEnter = (to, from, next) => {
		const user = store.state.user;
		if (user && user.id === 2)
			return next();
		next({ path: "/error/404", replace: true });
	};
	router.addRoutes([coneoleRoute]);

	const vue = new Vue({
		router,
		store,
		render: h => h("router-view", { attrs: { id: "app" } }),
	});
	return { vue, router, store };
}
