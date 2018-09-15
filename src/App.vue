<template>
	<div id="app">
		<router-view/>
		<kx-dialog-container/>
	</div>
</template>

<script>
import api from "./apis";

export default {
	created() {
		api.session.getCurrentUser()
			.then(user => this.$store.commit("setUser", user))
			.catch(() => console.error("无法连接账号服务器"));
	},
};
</script>
