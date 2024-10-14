import { createMemoryHistory, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "./views/index/IndexPage.vue";
import ErrorPage from "./views/error/ErrorPage.vue";
import ArticlePage from "./views/article/ArticlePage.vue";
import ListPage from "./views/list/ListPage.vue";
import LoginPage from "./views/login/LoginPage.vue";
import ProfilePage from "./views/user/ProfilePage.vue";
import AbortPage from "./views/about/AboutPage.vue";
import MeTab from "./views/about/MeTab.vue";
import FriendsTab from "./views/about/FriendsTab.vue";
import TechnologyTab from "./views/about/TechnologyTab.vue";
import CopyrightTab from "./views/about/CopyrightTab.vue";

/**
 * 路由表，这里把页面按照对访问速度的敏感性分成了 3 组，越靠前的越重要。
 *
 * TODO: 这版本错误页仅由路由显示，不太好处理 URL 不变但要显示错误的情况，以后考虑在 App 组件里再加个判断。
 */
const routes: RouteRecordRaw[] = [

	// 1）外链入口，是访问频率最高的页面，在优化时要优先考虑。
	{ path: "/", component: IndexPage },
	{ path: "/article/:id(\\d+)/:urlTitle", component: ArticlePage },
	{ path: "/article/:id(\\d+)", component: ArticlePage },

	// 2）其它前台页，对本站感兴趣的人才会看，他们的忍耐性更高些。
	{ path: "/list", redirect: "/list/0" }, // 废弃、以后一律要加页码
	{ path: "/list/:index(\\d+)", component: ListPage },
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

	// 3）后台和完整版编辑器，没有上面的那么重要，尽量分割出来。
	{
		path: "/edit/discussion",
		component: () => import("./views/editor/EditGuestPage.vue"),
	},
	{
		path: "/edit/draft/:draftId",
		component: () => import("./views/editor/EditArticlePage.vue"),
	},
	{
		path: "/edit/manual",
		component: () => import("./views/editor/EditDemoPage.vue"),
	},
	{
		path: "/console",
		redirect: "/console/article",
	},
	{
		path: "/console",
		name: "console",
		end: false,
		component: () => import("./views/console/ConsolePage.vue"),
		meta: { requireAuth: true },
	},

	// 错误页有些特殊，虽然访问频率不高，但还是打包到主模块里。
	{
		path: "/error/:value(\\d+)",
		props: true,
		component: ErrorPage,
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
