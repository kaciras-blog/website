import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "./css/Main.less";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import SkFadingCircle from "./components/SkFadingCircle";
import Framework from "./components/Framework";

Vue.component(TopNav.name, TopNav);
Vue.component(PageFooter.name, PageFooter);
Vue.component(SkFadingCircle.name, SkFadingCircle);
Vue.component(Framework.name, Framework);
Vue.config.productionTip = false;

new Vue({router, store, render: h => h("router-view")}).$mount('#app');
