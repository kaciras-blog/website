import { createMemoryHistory, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "./views/index/IndexPage.vue";
import ErrorPage from "./views/error/ErrorPage.vue";

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
		component: () => import("./views/list/ListPage.vue"),
		meta: { title: "所有文章" },
	},
	{
		path: "/login",
		component: () => import("./views/login/LoginPage.vue"),
		meta: { title: "登录" },
	},
	{
		path: "/article/:id",
		component: () => import("./views/article/ArticlePage.vue"),
	},
	{
		path: "/article/:id/:urlTitle",
		component: () => import("./views/article/ArticlePage.vue"),
	},
	{
		path: "/edit/:draftId",
		component: () => import("./views/editor/EditorPage.vue"),
		props: true,
		meta: { title: "文章编辑器" },
	},
	{
		path: "/profile",
		component: () => import("./views/user/ProfilePage.vue"),
		meta: { title: "用户" },
	},
	{
		path: "/about",
		component: () => import("./views/about/AboutPage.vue"),
		children: [
			{
				path: "me",
				component: () => import("./views/about/Me.vue"),
				meta: { title: "博主" },
			},
			{
				path: "friends",
				component: () => import("./views/about/Friends.vue"),
				meta: { title: "友链" },
			},
			{
				path: "technology",
				component: () => import("./views/about/Technology.vue"),
				meta: { title: "技术栈" },
			},
			{
				path: "copyright",
				component: () => import("./views/about/Copyrights.vue"),
				meta: { title: "版权声明" },
			},
		],
	},
	{
		path: "/console",
		component: () => import("./views/console/ConsolePage.vue"),
		meta: { title: "控制台", requireAuth: true },
	},
	{
		path: "/error/:value([0-9]+)",
		component: ErrorPage,
		props: true,
		meta: { title: "错误" },
	},
	{
		/*
		 * 【新版 vue-router 4 匹配串】
		 * 最开始的 :pathMatch 是参数，可以随意起名。
		 * (.*) 表示匹配一个目录内的任意值。
		 * 最后的 * 表示任意次数，加上它就能匹配深层目录。
		 */
		path: "/:pathMatch(.*)*",
		alias: "/error/404",
		component: ErrorPage,
		props: { value: "404" },
	},
];

export default function () {
	const history = typeof window !== "undefined"
		? createWebHistory()
		: createMemoryHistory();

	return createRouter({ history, routes });
}
