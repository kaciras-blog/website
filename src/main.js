import "./css/Main.less";
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";

import CommonComponents from "./components/common";
import KxDialog from "kxdialog";
import KxMarkdown from "./markdown";
import API from "./api";

import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import PageLayout from "./components/PageLayout";
import MessageBox from "./components/common/MessageBox";

import articleLink from "./article-url-mixin";


Vue.config.productionTip = false;

Vue.use(CommonComponents);
Vue.use(KxDialog);
Vue.use(KxMarkdown);
Vue.use(API);

Vue.filter("articleLink", articleLink);

Vue.component(TopNav.name, TopNav);
Vue.component(PageFooter.name, PageFooter);
Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
Vue.component(PageLayout.name, PageLayout);
Vue.component(MessageBox.name, MessageBox);

/**
 * 弹出一个简单的消息对话框。
 *
 * @param title 消息框的标题，或者一个对象包含了所有参数，如果使用了对象那么
 *                 后面的参数将无效。
 * @param content    消息框的内容
 * @param type 类型，error、warn 或 info（默认）
 * @param cancelable 是否显示取消按钮和右上角的关闭
 * @param dimmerClose 点击遮罩是否关闭窗口
 *
 * @return Promise<Boolean> 一个Promise，指示了窗口的状态和用户操作的结果，如果接受了true说
 *                             明用户点击了确定，false则点击了取消、遮罩或关闭按钮。
 */
Vue.prototype.$dialog.messageBox = function (title, content, type, cancelable, dimmerClose) {
	//使用对象传递的参数
	if (typeof title === "object") {
		return this.show(MessageBox.name, title);
	}
	return this.show(MessageBox.name, { title, content, type, cancelable, dimmerClose });
};

//自动聚焦支持 v-autofocus
Vue.directive("autofocus", {
	inserted: el => el.focus(),
});

export default function () {
	const store = createStore();
	const router = createRouter();

	/*
	 * 阻止未登录用户访问后台页面。
	 * router.app.$store获取不到store实例，所以就放在这了
	 */
	const coneoleRoute = {
		path: "/console",
		component: () => import("./views/console/ConsolePage"),
	};
	if (process.env.NODE_ENV === "production") {
		coneoleRoute.beforeEnter = (to, from, next) => {
			const user = store.state.user;
			if (user && user.id === 2)
				return next();
			next("/error/404");
		};
	}
	router.addRoutes([coneoleRoute]);

	const vue = new Vue({
		router,
		store,
		render: h => h(App),
	});
	return { vue, router, store };
}
