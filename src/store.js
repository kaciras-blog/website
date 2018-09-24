import Vue from "vue";
import Vuex from "vuex";
import api from "./apis";

Vue.use(Vuex);

export default function () {
	return new Vuex.Store({
		state: {
			user: null,	 // 当前登录的用户，没登录为null
		},
		actions: {
			refreshUser({ commit }) {
				return api.session.getCurrentUser()
					.then(user => commit("setUser", user))
					.catch(() => console.error("无法连接账号服务器"));
			},
		},
		mutations: {
			setUser: (state, info) => state.user = info,
			clearUser: state => state.user = null,
		},
	});
}
