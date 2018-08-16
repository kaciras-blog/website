import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Index from "./views/Index";
import Error from "./views/Error";

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
			path: "/error/:code",
			name: "error",
			component: Error
		},
		{
			path: "*",
			alias: "/error/404",
			component: Error,
		}
	]
})
