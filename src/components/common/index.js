import ButtonPager from "./ButtonPager";
import ScrollPager from "./ScrollPager";
import SkFadingCircle from "./SkFadingCircle";
import Swiper from "./Swiper";
import ToggleButton from "./ToggleButton";
import TransitionCurtain from "./TransitionCurtain";
import ScrollPageingView from "./ScrollPageingView";
import ButtonPageingView from "./ButtonPageingView";
import KxCheckBox from "./KxCheckBox";
import KxButton from "./KxButton";
import KxTaskButton from "./KxTaskButton";
import KxCarousel from "./KxCarousel";

/**
 * 自动注册目录下的Vue组件。
 *
 * @param Vue Vue类型，使用Vue.use()来注册该插件
 */
export default function install(Vue) {
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

//	IDE 无法分析自动扫描的引用
// 	const requireContext = require.context(".", false,  /.vue$/);
// 	requireContext.keys().forEach(file => {
// 		const component = requireContext(file).default;
// 		Vue.component(component.name, component);
// 	});
}
