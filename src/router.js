import Vue from 'vue';
import Router from 'vue-router';
import Article from './views/Article';
import Login from './views/Login';
import Index from "./views/Index";
import Error from "./views/Error";
import Console from "./views/Console";
import ArticleConsole from "./views/ArticleConsole";

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			component: Index,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
		},
		{
			path: '/article/:id',
			name: 'article',
			component: Article,
		},
		{
			path: "/console",
			name: "console",
			component: Console,
			children: [
				{ path: "", redirect: "article" },
				{ path: "article", component: ArticleConsole },
			],
		},
		{
			path: "/error/:code",
			name: "error",
			component: Error,
		},
		{
			path: "*",
			alias: "/error/404",
			component: Error,
		},
	],
});
