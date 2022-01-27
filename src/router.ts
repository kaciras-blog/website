import { createMemoryHistory, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "./views/index/Index.vue";
import ErrorPage from "./views/error/Index.vue";

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
// function scrollBehavior(
// 	to: RouteLocationNormalized,
// 	from: RouteLocationNormalizedLoaded,
// 	savedPosition: ScrollPositionCoordinates | null
// ) {
// 	if (savedPosition) {
// 		return savedPosition;
// 	} else {
// 		const position: any = {};
// 		if (to.hash) {
// 			position.selector = decodeURIComponent(to.hash);
// 		}
// 		if (!to.matched.some(m => m.meta.retainScroll)) {
// 			position.x = 0;
// 			position.y = 0;
// 		}
// 		return position;
// 	}
// }

const routes: RouteRecordRaw[] = [
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
		component: () => import(/* webpackChunkName: "list" */ "./views/list/Index.vue"),
		meta: { title: "所有文章" },
	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ "./views/login/Index.vue"),
		meta: { title: "登录" },
	},
	{
		path: "/article/:id",
		component: () => import(/* webpackChunkName: "article" */ "./views/article/Index.vue"),
	},
	{
		path: "/article/:id/:urlTitle",
		component: () => import(/* webpackChunkName: "article" */ "./views/article/Index.vue"),
	},
	{
		path: "/edit/:draftId",
		component: () => import(/* webpackChunkName: "edit" */ "./views/editor/Index.vue"),
		props: true,
		meta: { title: "文章编辑器" },
	},
	{
		path: "/profile",
		component: () => import(/* webpackChunkName: "profile" */ "./views/user/Index.vue"),
		meta: { title: "用户" },
	},
	{
		path: "/about",
		component: () => import(/* webpackChunkName: "about" */ "./views/about/Index.vue"),
		children: [
			{
				path: "me",
				component: () => import(/* webpackChunkName: "about" */ "./views/about/Me.vue"),
				meta: { title: "博主" },
			},
			{
				path: "friends",
				component: () => import(/* webpackChunkName: "about" */ "./views/about/Friends.vue"),
				meta: { title: "友链" },
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
		component: () => import(/* webpackChunkName: "console" */ "./views/console/Index.vue"),
		meta: { title: "控制台", requireAuth: true },
	},
	{
		path: "/error/:code",
		component: ErrorPage,
		props: true,
		meta: { title: "错误" },
	},
	{
		path: "/:pathMatch(.*)*",
		alias: "/error/404",
		component: ErrorPage,
		props: { code: "404" },
	},
];

export default function () {
	const history = typeof window !== "undefined"
		? createWebHistory()
		: createMemoryHistory();

	return createRouter({ history, routes })
}
