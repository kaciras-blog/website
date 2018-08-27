import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "./css/Main.less";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import SkFadingCircle from "./components/SkFadingCircle";
import Framework from "./components/Framework";
import apis from "./apis";
import KxDialog from "kxdialog/src/index";

Vue.use(KxDialog);

Vue.component(TopNav.name, TopNav);
Vue.component(PageFooter.name, PageFooter);
Vue.component(SkFadingCircle.name, SkFadingCircle);
Vue.component(Framework.name, Framework);

Vue.config.productionTip = false;
Vue.config.performance = true;

//自动聚焦支持 v-autofocus
Vue.directive('autofocus', {
	inserted: el => el.focus(),
});

new Vue({
	router, store,
	render: h => h(App),
	created() {
		apis.session.getCurrentUser().then(user => this.$store.commit("setUser", user));
	},
}).$mount('#app');
