<template>
	<nav :class="$style.container">
		<router-link
			:class="$style.logo"
			to="/"
			title="LOGO，点击回到首页"/>

		<top-nav-wide v-if="$mediaQuery.match('desktop+')"/>

		<div v-else class="nav-item nav-right" @click="showMenu">
			<i class="fas fa-bars"></i>
		</div>
	</nav>
</template>

<script>
import TopNavWide from "./TopNavWide";
import TopNavMenu from "./TopNavMenu";

export default {
	name: "TopNav",
	components: { TopNavWide },
	methods: {
		showMenu() {
			this.$dialog.show(TopNavMenu);
		},
	},
};
</script>

<style module lang="less">
@import "../css/Imports.less";

.container {
	position: relative;
	display: flex;
	.full-percent;

	background-color: rgba(255, 255, 255, .4);
	box-shadow: rgba(0, 0, 0, .2) 0 0 3px 1px; // TODO: 不共用？

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 0 5%;
		}
	}
}

.logo {
	@logo-width: 150px;

	display: block;
	width: @logo-width;

	background: url("../assets/img/logo-kaciras-wide.svg");
	background-size: @logo-width 200%;

	&:hover, &:focus {
		background-position: 0 100%;
	}
}

:global(.dark) .container {
	background-color: rgba(255, 255, 255, .1);
}
</style>
