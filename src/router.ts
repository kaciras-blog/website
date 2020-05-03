import Vue from "vue";
import Router from "vue-router";
import { Position, Route } from "vue-router/types/router";
import IndexPage from "./views/index/IndexPage.vue";
import ErrorPage from "./views/error/ErrorPage.vue";

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
 * @return 滚动的位置
 */
function scrollBehavior(to: Route, from: Route, savedPosition: Position | void) {
	if (savedPosition) {
		return savedPosition;
	} else {
		const position: any = {};
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

export default function CreateRouter() {
	const routes = [
		{
			path: "/",
			component: IndexPage,
			meta: { title: "首页" },
		},
		{
			path: "/list",
			redirect: "/list/0",
		},
		{
			path: "/list/:index",
			component: () => import(/* webpackChunkName: "list" */ "./views/list/ArticleListPage.vue"),
			meta: { title: "所有文章" },
		},
		{
			path: "/category/:id",
			component: () => import(/* webpackChunkName: "category" */"./views/category/CategoryPage.vue"),
		},
		{
			path: "/category/:id/:name",
			component: () => import(/* webpackChunkName: "category" */ "./views/category/CategoryPage.vue"),
		},
		{
			path: "/login",
			component: () => import(/* webpackChunkName: "login" */ "./views/login/LoginPage.vue"),
			meta: { title: "登录" },
		},
		{
			path: "/article/:id",
			component: () => import(/* webpackChunkName: "article" */ "./views/article/ArticlePage.vue"),
		},
		{
			path: "/article/:id/:urlTitle",
			component: () => import(/* webpackChunkName: "article" */ "./views/article/ArticlePage.vue"),
		},
		{
			path: "/edit/:id",
			component: () => import(/* webpackChunkName: "edit" */ "./views/editor/EditPage.vue"),
			meta: { title: "文章编辑器" },
		},
		{
			path: "/profile",
			component: () => import(/* webpackChunkName: "profile" */ "./views/user/UserProfilePage.vue"),
			meta: { title: "用户" },
		},

		// webpackChunkName 告诉 webpack 把他们打包在一个文件里
		{
			path: "/about",
			component: () => import(/* webpackChunkName: "about" */ "./views/about/AboutPage.vue"),
			children: [
				{
					path: "",
					redirect: "blogger",
				},
				{
					path: "blogger",
					component: () => import(/* webpackChunkName: "about" */ "./views/about/Blogger.vue"),
					meta: { title: "关于博主" },
				},
				{
					path: "technology",
					component: () => import(/* webpackChunkName: "about" */ "./views/about/Technology.vue"),
					meta: { title: "技术栈" },
				},
				{
					path: "copyright",
					component: () => import(/* webpackChunkName: "about" */ "./views/about/Copyrights.vue"),
					meta: { title: "版权声明" },
				},
			],
		},
		{
			path: "/console",
			component: () => import(/* webpackChunkName: "console" */ "./views/console/ConsolePage.vue"),
			meta: { title: "控制台", requireAuth: true },
		},
		{
			path: "/error/:code",
			component: ErrorPage,
			props: true,
			meta: { title: "错误" },
		},
		{
			path: "*",
			alias: "/error/404",
			component: ErrorPage,
			props: { code: "404" },
		},
	];

	return new Router({ mode: "history", scrollBehavior, routes });
}
