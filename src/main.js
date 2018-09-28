import "./css/Main.less";
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";

import CommonComponents from "./components/common";
import KxDialog from "kxdialog";
import KxMarkdown from "./markdown";
import API from "./apis";

import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import PageLayout from "./components/PageLayout";

import articleLink from "./article-url-mixin";

Vue.use(CommonComponents);
Vue.use(KxDialog);
Vue.use(KxMarkdown);
Vue.use(API);

Vue.filter("articleLink", articleLink);

Vue.component(TopNav.name, TopNav);
Vue.component(PageFooter.name, PageFooter);
Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
Vue.component(PageLayout.name, PageLayout);

Vue.config.productionTip = false;

//自动聚焦支持 v-autofocus
Vue.directive("autofocus", {
	inserted: el => el.focus(),
});

export default function () {
	const store = createStore();
	const router = createRouter();

	/*
	 * router.app.$store获取不到store实例，所以就放在这了
	 */
	router.addRoutes([
		{
			path: "/console",
			component: () => import("./views/console/ConsolePage"),
			// beforeEnter: (to, from, next) => {
			// 	const user = store.state.user;
			// 	if(user && user.id === 2)
			// 		return next();
			// 	next("/error/404");
			// },
		},
	]);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
