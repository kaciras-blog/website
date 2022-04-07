import { createMemoryHistory, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "./views/index/IndexPage.vue";
import ErrorPage from "./views/error/ErrorPage.vue";

/*
 * Vite 不支持自定义代码分割，如果自定义 manualChunks 的话也没法复用 Vite 内部的逻辑：
 * https://github.com/vitejs/vite/blob/a0126441a556b4991ac14cf037820194ab9e17b9/packages/vite/src/node/build.ts#L619
 *
 * 如果用动态导入，关于页的子路由组件全会被分割，都是很小的文件完全不值得，如果能合并成一个的话还行。
 */
import AbortPage from "./views/about/AboutPage.vue";
import AbortMe from "./views/about/Me.vue";
import AbortFriends from "./views/about/Friends.vue";
import AbortTechnology from "./views/about/Technology.vue";
import AbortCopyrights from "./views/about/Copyrights.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: IndexPage,
	},
	{
		path: "/list",
		redirect: "/list/0",
	},
	{
		path: "/list/:index",
		component: () => import("./views/list/ListPage.vue"),
	},
	{
		path: "/login",
		component: () => import("./views/login/LoginPage.vue"),
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
	},
	{
		path: "/profile",
		component: () => import("./views/user/ProfilePage.vue"),
	},
	{
		path: "/about",
		component: AbortPage,
		children: [
			{
				path: "me",
				component: AbortMe,
			},
			{
				path: "friends",
				component: AbortFriends,
			},
			{
				path: "technology",
				component: AbortTechnology,
			},
			{
				path: "copyright",
				component: AbortCopyrights,
			},
		],
	},
	{
		path: "/console",
		component: () => import("./views/console/ConsolePage.vue"),
		meta: { requireAuth: true },
	},
	{
		path: "/error/:value([0-9]+)",
		component: ErrorPage,
		props: true,
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

export default () => createRouter({
	routes,
	scrollBehavior(to, from, saved) {
		if (saved) {
			return saved;
		} else if (to.hash) {
			return { el: to.hash };
		} else {
			return { top: 0 };
		}
	},
	history: import.meta.env.SSR
		? createMemoryHistory() : createWebHistory(),
});
