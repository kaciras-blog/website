import ButtonPager from "./ButtonPager";
import ScrollPager from "./ScrollPager";
import SkFadingCircle from "./SkFadingCircle";
import Swiper from "./FadeCarousel";
import ToggleButton from "./ToggleButton";
import TransitionCurtain from "../TransitionCurtain";
import ScrollPageingView from "./ScrollPageingView";
import ButtonPageingView from "./ButtonPageingView";
import KxCheckBox from "./KxCheckBox";
import KxButton from "./KxButton";
import KxTaskButton from "./KxTaskButton";
import KxCarousel from "./KxCarousel";
import KxDialogContainer from "./KxDialogContainer.vue";
import KxBaseDialog from "./KxBaseDialog.vue";
import KxContextMenu from "./KxContextMenu.vue";


function installKxDialog (Vue) {
	Vue.component(KxDialogContainer.name, KxDialogContainer);
	Vue.component(KxBaseDialog.name, KxBaseDialog);
	Vue.component(KxContextMenu.name, KxContextMenu);

	const eventBus = new Vue();

	Vue.prototype.$dialog = {
		eventBus,
		/**
		 * 弹出一个窗口。
		 *
		 * @param component 弹窗组件
		 * @param data 传递给弹窗的数据
		 * @return {Promise<*>} 一个Promise，在窗口关闭后完成，使用then函数来获取窗口的返回值
		 */
		show (component, data) {
			return new Promise(resolve => eventBus.$emit("show", { component, data, resolve }));
		},
		/**
		 * 关闭最上层的弹窗，并返回一个结果。
		 *
		 * @param data 返回给调用方的结果。
		 */
		close (data) {
			eventBus.$emit("close", data);
		},
	};

	const dialog = new Vue(KxDialogContainer).$mount();
	document.body.appendChild(dialog.$el);
}

/**
 * 自动注册目录下的Vue组件。
 *
 * @param Vue Vue类型，使用Vue.use()来注册该插件
 */
function install (Vue) {
	Vue.component(SkFadingCircle.name, SkFadingCircle);
	Vue.component(ButtonPager.name, ButtonPager);
	Vue.component(ScrollPager.name, ScrollPager);
	Vue.component(Swiper.name, Swiper);
	Vue.component(TransitionCurtain.name, TransitionCurtain);
	Vue.component(ToggleButton.name, ToggleButton);
	Vue.component(ScrollPageingView.name, ScrollPageingView);
	Vue.component(ButtonPageingView.name, ButtonPageingView);
	Vue.component(KxCheckBox.name, KxCheckBox);
	Vue.component(KxButton.name, KxButton);
	Vue.component(KxTaskButton.name, KxTaskButton);
	Vue.component(KxCarousel.name, KxCarousel);

	if (typeof window !== "undefined") {
		installKxDialog(Vue);
	}

	// 自动聚焦支持 v-autofocus
	Vue.directive("autofocus", {
		inserted: el => el.focus(),
	});

	// 文本选区绑定
	Vue.directive("bind-selection", {
		inserted (el, { expression, modifiers }, vnode) {
			const vm = vnode.context;
			vm.$watch(expression, nv => {
				const [s, e] = nv;
				el.selectionStart = s;
				el.selectionEnd = e;
				if (modifiers.focus) el.focus();
			});
		},
	});

	// 文本选区改变监听
	Vue.directive("on-selection-changed", {
		inserted (el, { expression }, vnode) {
			const vm = vnode.context;

			let oldStart = el.selectionStart;
			let oldEnd = el.selectionEnd;

			function handleSelect () {
				const { selectionStart, selectionEnd } = el;
				if (oldStart !== selectionStart || oldEnd !== selectionEnd) {
					oldStart = selectionStart;
					oldEnd = selectionEnd;
					vm[expression](selectionStart, selectionEnd);
				}
			}

			el.addEventListener("click", handleSelect);		// 鼠标点击改变光标位置
			el.addEventListener("input", handleSelect);		// 增删内容改变光标位置
			el.addEventListener("keyup", handleSelect);		// Home,End,PageUp,PageDown
			el.addEventListener("keydown", handleSelect);	// 移动光标的键按住不放
		},
	});

//	IDE 无法分析自动扫描的引用
// 	const requireContext = require.context(".", false,  /.vue$/);
// 	requireContext.keys().forEach(file => {
// 		const component = requireContext(file).default;
// 		Vue.component(component.name, component);
// 	});
}

// Auto-install
let GlobalVue = null;
if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(install);
}

export * from "./helpers";
export default install;
