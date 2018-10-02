import Vue from "vue";
import Router from "vue-router";
import Error from "./views/error/Error";
import Welcome from "./views/welcome/Welcome";


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
			component: () => import("./views/index/IndexPage"),
		},
		{
			path: "/page/:index",
			component: () => import("./views/index/IndexPage"),
		},
		{
			path: "/category/:name",
			component: () => import("./views/category/Category"),
		},
		{
			path: "/welcome",
			naem: "welcome",
			component: Welcome,
		},
		{
			path: "/login",
			name: "login",
			component: () => import("./views/login/LoginPage"),
		},
		{
			path: "/article/:id",
			component: () => import("./views/article/Article"),
		},
		{
			path: "/article/:id/:urlTitle",
			name: "article",
			component: () => import("./views/article/Article"),
		},
		{
			path: "/edit/:id",
			name: "edit",
			component: () => import("./views/ArticleEditor"),
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
