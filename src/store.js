import Vue from 'vue';
import Vuex from 'vuex';
import api from "./apis";

Vue.use(Vuex);

export default function () {
	return new Vuex.Store({
		state: {
			user: null,	 // 当前登录的用户，没登录为null
			article: {},
		},
		actions: {
			fetchItem({commit}, id) {
				// `store.dispatch()` 会返回 Promise，以便我们能够知道数据在何时更新
				return api.article.get(id).then(item => commit('setArticle', item));
			},
		},
		mutations: {
			setUser: (state, info) => state.user = info,
			clearUser: state => state.user = null,
			setArticle: (state, item) => state.article = item,
		},
	});
}
