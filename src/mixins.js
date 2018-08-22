/**
 * 在组件挂载前给Html元素设置全屏宽高，组件销毁前移除设置。
 */
export const FullScreen = {
	mounted() {
		document.getElementsByTagName("html")[0].classList.add("full-screen");
	},
	beforeDestroy() {
		document.getElementsByTagName("html")[0].classList.remove("full-screen");
	},
};
