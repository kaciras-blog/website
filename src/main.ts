import "@kaciras-blog/uikit/dist/style.css";
import "./css/index.less";
import { createApp, createSSRApp } from "vue";
import UIKit, { MediaQueryManager } from "@kaciras-blog/uikit";
import createStore from "./store";
import createRouter from "./router";
import BlogPlugin from "./blog-plugin";
import App from "./App.vue";

export const mediaBreakpoints = {
	mobile: 768,
	tablet: 992,
	desktop: 1200,
	wide: 99999,
};

export const mediaQueryPlugin = new MediaQueryManager(mediaBreakpoints);

/**
 * 服务端和客户端公共的初始化逻辑。
 *
 * 由于创建Vue实例后就立即渲染，而此时可能就需要初始状态（比如控制台页面鉴权），
 * 所以不能等到创建之后再替换服务端渲染出的初始状态，而要在创建Vue实例之前就调用 store.replaceState(...)
 *
 * @param initState Vuex 的初始状态
 * @return Vue 全家桶
 */
export default function createBlogApp(initState: any = undefined) {
	const store = createStore();
	const router = createRouter();

	mediaQueryPlugin.registerToStore(store);

	if (initState) {
		store.replaceState(initState);
	}

	/**
	 * 阻止未登录用户访问后台页面。
	 *
	 * TODO: 放在这好丑啊
	 */
	router.beforeEach((to, from, next) => {
		if (!to.meta.requireAuth) {
			return next();
		}
		const { user } = store.state;

		if (user.id === 2) {
			return next();
		}
		next({ path: "/login", query: { return_uri: "/console" } });
	});

	const app = initState ? createSSRApp(App) : createApp(App);

	app.use(store);
	app.use(router);
	app.use(UIKit);
	app.use(BlogPlugin);
	app.use(mediaQueryPlugin);

	return { app, router, store };
}
