import "./css/Main.less";
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";

import CommonComponents from "./components/common";
import KxDialog from "kxdialog";
import KxMarkdown from "./markdown";
import BlogPlugin from "./blog-plugin";


Vue.config.productionTip = false;

Vue.use(CommonComponents);
Vue.use(KxDialog);
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
	};
	if (process.env.NODE_ENV === "production") {
		coneoleRoute.beforeEnter = (to, from, next) => {
			const user = store.state.user;
			if (user && user.id === 2)
				return next();
			next("/error/404");
		};
	}
	router.addRoutes([coneoleRoute]);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
