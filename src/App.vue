<template>
	<div id="app">
		<top-nav v-if="topNav.show" v-bind="topNav"/>
		<router-view @layout-changed="configLayout"/>
		<page-footer v-if="showFooter"/>
		<kx-dialog-container/>
	</div>
</template>

<script>
import api from "./apis";

export default {
	data() {
		return {
			topNav: {
				show: true,
				clazz: null,
				banner: true,
			},
			showFooter: true,
		};
	},
	methods: {
		configLayout(nav, showFooter) {
			if (typeof nav === "function") {
				nav = nav();
			}
			Object.assign(this.topNav, nav);
			this.showFooter = showFooter;
		},
	},
	created() {
		api.session.getCurrentUser()
			.then(user => this.$store.commit("setUser", user))
			.catch(() => console.error("无法连接账号服务器"));
	},
	watch: {
		//当视图切换时重置布局（仅最外层路由切换）
		'$route'(to, form) {
			const toPage = to.path.split("/")[1];
			const formPage = form.path.split("/")[1];

			if (toPage !== formPage) {
				this.topNav.show = true;
				this.topNav.clazz = null;
				this.topNav.banner = false;
				this.showFooter = true;
			}
		},
	},
};
</script>
