import Vue from "vue";
import Vuex from "vuex";
import api from "../api";
import { REFRESH_USER, REMOVE_USER, SET_USER, SET_PREFETCH_DATA } from "./types";


Vue.use(Vuex);

export default function () {
	return new Vuex.Store({
		state: {
			user: null, // 当前登录的用户，没登录为null
			prefetch: {},
		},
		actions: {
			async [REFRESH_USER] ({ commit }, prototype) {
				const res = await api.withPrototype(prototype).user.getCurrent();
				if (res.status < 300) {
					commit(SET_USER, res.data);
				}
			},
			[REMOVE_USER] ({ commit }) {
				return api.user.logout().then(() => commit(SET_USER, null));
			},
		},
		mutations: {
			[SET_USER]: (state, info) => state.user = info,
			[SET_PREFETCH_DATA]: (state, data) => state.prefetch = data,
		},
	});
}
