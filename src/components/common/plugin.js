import ButtonPager from "./ButtonPager";
import ScrollPager from "./ScrollPager";
import SkFadingCircle from "./SkFadingCircle";
import Swiper from "./Swiper";
import ToggleButton from "./ToggleButton";
import TransitionCurtain from "./TransitionCurtain";

export default function install(Vue, options) {
	Vue.component(SkFadingCircle.name, SkFadingCircle);
	Vue.component(ButtonPager.name, ButtonPager);
	Vue.component(ScrollPager.name, ScrollPager);
	Vue.component(Swiper.name, Swiper);
	Vue.component(TransitionCurtain.name, TransitionCurtain);
	Vue.component(ToggleButton.name, ToggleButton);
}
