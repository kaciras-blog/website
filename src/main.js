import "./css/Main.less";
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";

import CommonComponents from "./components/common";
import KxDialog from "kxdialog/src/index";
import KxMarkdown from "./markdown";

import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import PageLayout from "./components/PageLayout";

Vue.use(CommonComponents);
Vue.use(KxDialog);
Vue.use(KxMarkdown);

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

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
