import Vue from "vue";
import Vuex from "vuex";
import api from "../api";
import { REFRESH_USER, LOGOUT, SET_PREFETCH_DATA, SET_USER, SET_SUN_PHASE } from "./types";
import { SunPhases } from "@/sun-phase";

Vue.use(Vuex);

/**
 * 定义几个太阳位置：7-11 黎明，11-16 白天, 16 - 20 黄昏，20 - 7 夜晚。
 *
 * 这些时间并不通用，因为昼夜的长短还与纬度有关。应当通过太阳角度公式来计算，但是在浏览器里获取
 * 用户的位置信息并不方便，使用 navigator.geolocation 需要授权，为了这个功能去请求权限不划算。
 */
export const SUN_PHASES = new SunPhases({
	Dawn: 7,
	Daytime: 11,
	Dusk: 16,
	Night: 20,
});

export default function createVuexStore() {
	return new Vuex.Store({
		state: {
			/** 当前登录的用户，这个字段不会为 null 或 undefined，其值将在入口处被设置 */
			user: undefined,

			/** 路由页面的预取数据 */
			prefetch: {},

			/** 评论设置，因为不常变所以放到全局免得每次都读取 */
			discussionOptions: undefined,

			/**
			 * 当前的太阳阶段，值是上面 SUN_PHASES 的字段名，null 表明无法确定。
			 * 【注意】不要使用 undefined，$store.watch 无法监听值为 undefined 的字段。
			 */
			sunPhase: null,
		},
		actions: {
			async [REFRESH_USER]({ commit }, prototype) {
				const res = await api.withPrototype(prototype).user.getCurrent();
				if (res.status < 300) {
					commit(SET_USER, res.data);
				}
			},

			// 不要设为null，未登录用ID=0表示
			[LOGOUT]({ commit }) {
				const guest = { id: 0, name: "(游客)" };
				return api.user.logout().then(() => commit(SET_USER, guest));
			},

			loadOptions({ commit, state }) {
				if (typeof state.discussionOptions !== "undefined") {
					return;
				}
				return api.config.get("discussion").then(options => commit("setDiscussionOptions", options));
			},
		},
		mutations: {
			setDiscussionOptions: (state, data) => state.discussionOptions = data,
			[SET_USER]: (state, info) => state.user = info,
			[SET_PREFETCH_DATA]: (state, data) => state.prefetch = data,
			[SET_SUN_PHASE]: (state, value) => state.sunPhase = value,
		},
	});
}
