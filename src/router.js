import Vue from "vue";
import Router from "vue-router";
import Error from "./views/error/Error";
import Welcome from "./views/welcome/Welcome";

Vue.use(Router);

/**
 * 控制路由切换后的滚动位置，默认行为跟原生浏览器一致，通过设置路由元信息 meta
 * 的 retainScroll 选项可以跨页面保持位置。
 *
 * 抄自官方示例：
 * @link https://github.com/vuejs/vue-router/blob/next/examples/scroll-behavior/app.js
 *
 * @param to 原页面的路由对象
 * @param from 目标页面的路由对象
 * @param savedPosition 浏览器的[前进/后退]按钮触发时，上次页面的位置
 * @return {{ x: number, y: number }} 滚动的位置
 */
function scrollBehavior(to, from, savedPosition) {
	if (savedPosition) {
		return savedPosition;
	} else {
		const position = {};
		if (to.hash) {
			position.selector = to.hash;
		}
		if (!to.matched.some(m => m.meta.retainScroll)) {
			position.x = 0;
			position.y = 0;
		}
		return position;
	}
}

/*
 * 两种情况下使用异步组件：
 *   1.不常被访问的页面，如编辑器、控制台。
 *   2.预渲染的页面，如首页、文章页
 */
export default function () {
	const routes = [
		{
			path: "/",
			name: "index",
			component: () => import("./views/index/IndexPage"),
			meta: { title: "首页" },
		},
		{
			path: "/page/:index",
			component: () => import("./views/index/IndexPage"),
			meta: { title: "首页" },
		},
		{
			path: "/category/:name",
			component: () => import("./views/category/Category"),
		},
		{
			path: "/welcome",
			naem: "welcome",
			component: Welcome,
			meta: { title: "网站导航" },
		},
		{
			path: "/login",
			name: "login",
			component: () => import("./views/login/LoginPage"),
			meta: { title: "登录" },
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
			component: () => import("./views/editor/ArticleEditor"),
			meta: { title: "文章编辑器" },
		},
		{
			path: "/error/:code",
			name: "error",
			component: Error,
			props: true,
			meta: { title: "错误" },
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

	return new Router({ mode: "history", scrollBehavior, routes });
}
