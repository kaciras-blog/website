import { createMemoryHistory, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "./views/index/IndexPage.vue";
import ListPage from "./views/list/ListPage.vue";
import LoginPage from "./views/login/LoginPage.vue";
import ProfilePage from "./views/user/ProfilePage.vue";
import ErrorPage from "./views/error/ErrorPage.vue";
import ArticlePage from "./views/article/ArticlePage.vue";

import AbortPage from "./views/about/AboutPage.vue";
import MeTab from "./views/about/MeTab.vue";
import FriendsTab from "./views/about/FriendsTab.vue";
import TechnologyTab from "./views/about/TechnologyTab.vue";
import CopyrightTab from "./views/about/CopyrightTab.vue";

/**
 * 路由表，这里把页面按照对访问速度的敏感性分成了 3 组，越靠前的越重要。
 */
const routes: RouteRecordRaw[] = [
	
	// 外链入口，是访问频率最高的页面，在优化时要优先考虑。
	{ path: "/", component: IndexPage },
	{ path: "/article/:id/:urlTitle", component: ArticlePage },
	{ path: "/article/:id", component: ArticlePage },
	{
		path: "/error/:value([0-9]+)",
		props: true,
		component: ErrorPage,
	},

	// 其它前台页，重要性次之，是对本站感兴趣的用户才会看的，他们的忍耐性更高些。
	{ path: "/list", redirect: "/list/0" },
	{ path: "/list/:index", component: ListPage },
	{ path: "/login", component: LoginPage },
	{ path: "/profile", component: ProfilePage },
	{
		path: "/about",
		component: AbortPage,
		children: [
			{ path: "friends", component: FriendsTab },
			{ path: "me", component: MeTab },
			{ path: "technology", component: TechnologyTab },
			{ path: "copyright", component: CopyrightTab },
		],
	},

	// 后台只有管理员才用，没有上面的那么重要了。
	{
		path: "/edit/:draftId",
		component: () => import("./views/editor/EditorPage.vue"),
	},
	{
		path: "/console",
		component: () => import("./views/console/ConsolePage.vue"),
		meta: { requireAuth: true },
	},

	{
		/*
		 * 【vue-router 4 匹配串】
		 * 最开始的 :pathMatch 是参数，可以随意起名，(.*) 表示匹配一个目录内的任意值，
		 * 最后的 * 表示任意次数，加上它就能匹配深层目录。
		 */
		path: "/:pathMatch(.*)*",
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
