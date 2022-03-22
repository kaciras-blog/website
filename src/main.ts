import "@kaciras-blog/uikit/dist/style.css";
import "./css/index.less";
import { createApp, createSSRApp } from "vue";
import UIKit from "@kaciras-blog/uikit";
import { createPinia } from "pinia";
import { useCurrentUser } from "@/store";
import createRouter from "./router";
import BlogPlugin from "./blog-plugin";
import App from "./App.vue";

/**
 * 服务端和客户端公共的初始化逻辑。
 *
 * 由于创建Vue实例后就立即渲染，而此时可能就需要初始状态（比如控制台页面鉴权），
 * 所以不能等到创建之后再替换服务端渲染出的初始状态，而要在创建Vue实例之前就调用 store.replaceState(...)
 *
 * @param initState Pinia 的初始状态
 * @return Vue 全家桶
 */
export default function createBlogApp(initState?: any) {
	const store = createPinia();
	const router = createRouter();

	if (initState) {
		store.state.value = initState;
	}

	/**
	 * 阻止未登录用户访问后台页面，放在这同时作用于前后端渲染。
	 */
	router.beforeEach(to => {
		const user = useCurrentUser(store);
		if (to.meta.requireAuth && !user.isAdmin) {
			const return_uri = to.fullPath;
			return { path: "/login", query: { return_uri } };
		}
	});

	const app = initState ? createSSRApp(App) : createApp(App);

	app.use(store);
	app.use(router);
	app.use(UIKit);
	app.use(BlogPlugin);

	return { app, router, store };
}
