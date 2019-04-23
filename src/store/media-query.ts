import { Store } from "vuex";
import { VueConstructor } from "vue";
import Vue from "vue";

export const SET_SCREEN_WIDTH = "SET_SCREEN_WIDTH";

export interface MediaPoints {
	[key: string]: number;
}

export const DEFAULT_QUERIES: MediaPoints = {
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

/**
 * 监听 window.matchMedia() 的 change 事件，在窗口大小改变时自动修改Vuex的状态。
 * 该函数只能在浏览器环境下使用。
 * TODO: 用INDEX更好？ 没检查少于3个的情况
 *
 * @param store Vuex的存储
 */
export function observeWindow(store: Store<any>) {


	function commitToStore(name: string, query: string) {
		const mql = window.matchMedia(query);
		mql.addEventListener("change", (event) => event.matches && store.commit(SET_SCREEN_WIDTH, name));
	}

	const first = entries[0];
	commitToStore(first[0], `(max-width: ${first[1]}px`);

	for (let i = 1; i < entries.length - 1; i++) {
		const previous = entries[i - 1][1], current = entries[i][1];
		commitToStore(entries[i][0], `(min-width: ${previous}px) and (max-width: ${current}px)`);
	}

	const last = entries[entries.length - 1];
	commitToStore(last[0], `(min-width: ${last[1]}px`);
}


export function MediaQueryPlugin(Vue: VueConstructor) {

	Vue.prototype.$mediaMatch = function (this: Vue, exp: string) {
		const modifier = exp[exp.length - 1];
		if (modifier === "+") {
			exp = exp.substring(0, exp.length - 1);
			return this.$store.state.screenWidth >= DEFAULT_QUERIES[exp];
		}
		if (modifier === "-") {
			exp = exp.substring(0, exp.length - 1);
			return this.$store.state.screenWidth < DEFAULT_QUERIES[exp];
		}
		return this.$store.state.screenWidth === DEFAULT_QUERIES[exp];
	};

}
