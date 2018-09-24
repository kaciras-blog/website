import Vue from "vue";
import Router from "vue-router";
import Error from "./views/error/Error";
import Welcome from "./views/Welcome";


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
			name: "article",
			component: () => import("./views/article/Article"),
		},
		{
			path: "/edit/:id",
			name: "edit",
			component: () => import("./views/ArticleEditor"),
		},
		{
			path: "/console",
			component: () => import("./views/console/ConsolePage"),
			beforeEnter: (to, from, next) => {
				const user = router.app.$store.state.user;
				if(user && user.id === 2) next();
			},
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

	const router = new Router({ mode: "history", routes });
	return router;
}
