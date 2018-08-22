import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,	 // 当前登录的用户，没登录为null
	},
	mutations: {
		setUser: (state, info) => state.user = info,
		clearUser: state => state.user = null,
	},
	actions: {},
});
