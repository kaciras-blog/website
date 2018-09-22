import Vue from "vue";
import Router from "vue-router";
import Error from "./views/Error";
import Welcome from "./views/Welcome";

import ArticleConsole from "./views/console/ArticleConsole";
import DraftConsole from "./views/console/DraftConsole";
import CategoryConsole from "./views/console/CategoryConsole";
import SwiperConsole from "./views/console/SwiperConsole";

Vue.use(Router);

/*
 * 两种情况下使用异步组件：
 * 1.不常被访问的页面，如编辑器、控制台。
 * 2.预渲染的页面，如首页、文章页
 */
export default function () {
	const routes = [
		{
			path: "/",
			name: "index",
			component: () => import("./views/Index"),
		},
		{
			path: "/page/:index",
			component: () => import("./views/Index"),
			props: route => ({ index: parseInt(route.params.index ) }),
		},
		{
			path: "/welcome",
			naem: "welcome",
			component: Welcome,
		},
		{
			path: "/login",
			name: "login",
			component: () => import("./views/Login"),
		},
		{
			path: "/article/:id",
			name: "article",
			component: () => import("./views/Article"),
		},
		{
			path: "/edit/:id",
			name: "edit",
			component: () => import("./views/ArticleEditor"),
		},
		{
			path: "/console",
			component: () => import("./views/Console"),
			children: [
				{ path: "", name: "console", redirect: "article" },
				{ path: "article", component: ArticleConsole },
				{ path: "swiper", component: SwiperConsole },
				{ path: "draft", component: DraftConsole },
				{ path: "category", component: CategoryConsole },
			],
		},
		{
			path: "/error/:code",
			name: "error",
			component: Error,
			props: true,
		},
		{
			path: "*",
			alias: "/error/404",
			component: Error,
			props: { code: "404" },
		},
	];
	// 用来测试的页面
	if (process.env.NODE_ENV !== "production") {
		routes.unshift({ path: "/test", component: () => import("./views/Test") });
	}
	return new Router({ mode: "history", routes });
}
