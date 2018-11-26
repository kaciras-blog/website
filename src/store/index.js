import Vue from "vue";
import Vuex from "vuex";
import api from "../api";
import { REFRESH_USER, REMOVE_USER, SET_USER } from "./types";


Vue.use(Vuex);

export default function () {
	return new Vuex.Store({
		state: {
			user: null,	 // 当前登录的用户，没登录为null
		},
		actions: {
			async [REFRESH_USER] ({ commit }) {
				const res = await api.user.getCurrent();
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
		},
	});
}
