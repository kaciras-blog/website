<template>
	<nav class="content">

		<router-link
			class="logo-kaciras"
			to="/welcome"
			title="LOGO，点击回到首页"/>

		<div class="nav-item" @click="showMenu">
			<i class="fas fa-bars"></i>
		</div>
	</nav>
</template>

<script>
import TopNavMenu from "./TopNavMenu";

export default {
	name: "TopNavCollapsed",
	methods: {
		showMenu() {
			this.$dialog.show(TopNavMenu);
		},
	},
};
</script>
