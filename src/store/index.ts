import { createStore } from "vuex";
import api, { AuthType, User } from "@/api";
import { SunPhases } from "@/sun-phase";
import {
	LOAD_DISCUSSION_OPTIONS,
	LOGOUT,
	REFRESH_USER,
	SET_DISCUSSION_OPTIONS,
	SET_PREFETCH_DATA,
	SET_SUN_PHASE,
	SET_USER
} from "./types";

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

const GUESTS: User = {
	id: 0,
	name: "(游客)",
	avatar: "/static/img/akalin.jpg",
	auth: AuthType.None,
}

export default function createVuexStore() {
	return createStore({
		state: {
			/** 当前登录的用户，其值将在入口处被设置 */
			user: GUESTS,

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
			async [REFRESH_USER]({ commit }, apiUse = api) {
				const res = await apiUse.user.getCurrent();
				if (res.status < 300) {
					commit(SET_USER, res.data);
				}
			},

			// 不要设为null，未登录用 id=0 表示
			[LOGOUT]({ commit }) {
				return api.user.logout().then(() => commit(SET_USER, GUESTS));
			},

			async [LOAD_DISCUSSION_OPTIONS]({ commit, state }) {
				if (typeof state.discussionOptions !== "undefined") {
					return;
				}
				commit(SET_DISCUSSION_OPTIONS, await api.config.get("discussion"));
			},
		},
		mutations: {
			[SET_DISCUSSION_OPTIONS]: (state, data) => state.discussionOptions = data,
			[SET_USER]: (state, data) => state.user = data,
			[SET_PREFETCH_DATA]: (state, data) => state.prefetch = data,
			[SET_SUN_PHASE]: (state, value) => state.sunPhase = value,
		},
	});
}
