import "./css/Main.less";
import Vue from 'vue';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import CommonComponents from "./components/common/plugin";
import KxDialog from "kxdialog/src/index";
import SelectCategoryDialog from "./components/SelectCategoryDialog";
import { sync } from 'vuex-router-sync';

Vue.use(CommonComponents);
Vue.use(KxDialog);

Vue.component(TopNav.name, TopNav);
Vue.component(PageFooter.name, PageFooter);
Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);

Vue.config.productionTip = false;
Vue.config.performance = true;

//自动聚焦支持 v-autofocus
Vue.directive('autofocus', {
	inserted: el => el.focus(),
});

export default function () {
	const store = createStore();
	const router = createRouter();

	sync(store, router);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
