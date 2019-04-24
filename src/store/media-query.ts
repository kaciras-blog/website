import { Store } from "vuex";
import { VueConstructor } from "vue";
import Vue from "vue";

export const SET_SCREEN_WIDTH = "SET_SCREEN_WIDTH";

export interface MediaBreakPoints {
	[key: string]: number;
}

export const DEFAULT_QUERIES: MediaBreakPoints = {
	mobile: 768,
	tablet: 992,
	desktop: 1200,
	wide: Infinity,
};

const entries = Object.entries(DEFAULT_QUERIES);
entries.sort((a, b) => a[1] - b[1]);

export const mediaQueryModule = {
	state: {
		screenWidth: DEFAULT_QUERIES.wide,
	},
	mutations: {
		[SET_SCREEN_WIDTH]: (state: any, name: string) => state.screenWidth = name,
	},
};

export function registerToStore(store: Store<any>) {
	store.registerModule("mediaQuery", mediaQueryModule);
}

/**
 * 监听 window.matchMedia() 的 change 事件，在窗口大小改变时自动修改Vuex的状态。
 * 该函数只能在浏览器环境下使用。
 * TODO: 用INDEX更好？ 没检查少于3个的情况
 *
 * @param store Vuex的存储
 */
export function observeWindow(store: Store<any>) {

	function observe(width: number, query: string) {
		const mql = window.matchMedia(query);
		mql.addEventListener("change", (event) => event.matches && store.commit(SET_SCREEN_WIDTH, name));
	}

	const first = entries[0];
	observe(first[1], `(max-width: ${first[1]}px`);

	for (let i = 1; i < entries.length - 1; i++) {
		const previous = entries[i - 1][1], current = entries[i][1];
		observe(entries[i][1], `(min-width: ${previous}px) and (max-width: ${current}px)`);
	}

	const last = entries[entries.length - 1];
	observe(last[1], `(min-width: ${entries[entries.length - 2][1]}px`);
}

/**
 * 注册为Vue的插件，别忘了还要注册一个Vuex的模块。
 *
 * @param Vue Vue对象
 */
export function MediaQueryPlugin(Vue: VueConstructor) {

	/**
	 * 检测给定的查询是否符合当前的屏幕宽度。
	 * 查询字符串由 `断点名 + 修饰符（可选）` 组成，修饰符可以是 `+` 或 `-`，分别表示大于
	 * 等于和小于，没有修饰符表示等于。
	 *
	 * 例如当断点选项为：{ mobile: 100, desktop: 200, wide: 300 }，当前宽度为 desktop 时：
	 * mobile   返回 false：当前宽度不是mobile
	 * mobile+  返回 true： 当前宽度大于mobile
	 * desktop  返回 true： 当前宽度等于desktop
	 * desktop+ 返回 true： 当前宽度大于等于desktop
	 * desktop- 返回 false：当前宽度不小于desktop
	 * wide-    返回 true： 当前宽度小于wide
	 *
	 * @param exp 查询字符串
	 * @return 当前宽度是否匹配给定的查询字符串
	 */
	Vue.prototype.$mediaMatch = function (this: Vue, exp: string) {
		const modifier = exp[exp.length - 1];
		const width = this.$store.state.mediaQuery.screenWidth;

		if (modifier === "+") {
			return width >= DEFAULT_QUERIES[exp = exp.substring(0, exp.length - 1)];
		}
		if (modifier === "-") {
			return width < DEFAULT_QUERIES[exp = exp.substring(0, exp.length - 1)];
		}
		return width === DEFAULT_QUERIES[exp];
	};

}
