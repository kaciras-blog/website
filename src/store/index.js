import Vue from "vue";
import Vuex from "vuex";
import api from "../api";
import { REFRESH_USER, REMOVE_USER, SET_PREFETCH_DATA, SET_USER, SET_SUN_PHASE } from "./types";
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
			user: undefined,
			prefetch: {},
			discussionOptions: undefined,
			sunPhase: "Daytime",
		},
		actions: {
			async [REFRESH_USER]({ commit }, prototype) {
				const res = await api.withPrototype(prototype).user.getCurrent();
				if (res.status < 300) {
					commit(SET_USER, res.data);
				}
			},

			// 不要设为null，未登录用ID=0表示
			[REMOVE_USER]({ commit }) {
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
