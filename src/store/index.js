import Vue from "vue";
import Vuex from "vuex";
import api from "../api";
import { REFRESH_USER, REMOVE_USER, SET_PREFETCH_DATA, SET_USER } from "./types";

Vue.use(Vuex);

export default function createVuexStore() {
	return new Vuex.Store({
		state: {
			user: undefined,
			prefetch: {},
			discussionOptions: undefined,
		},
		actions: {
			async [REFRESH_USER]({ commit }, prototype) {
				const res = await api.withPrototype(prototype).user.getCurrent();
				if (res.status < 300) {
					commit(SET_USER, res.data);
				}
			},
			[REMOVE_USER]({ commit }) {
				return api.user.logout().then(() => commit(SET_USER, null));
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
		},
	});
}
