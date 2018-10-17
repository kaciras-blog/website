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
			[REFRESH_USER] ({ commit }) {
				return api.user.getCurrent()
					.then(user => commit(SET_USER, user))
					.catch(() => {}); // ignore no logined.
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
