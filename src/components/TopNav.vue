<template>
	<nav :class="$style.container">
		<router-link
			:class="$style.logo"
			to="/"
			title="LOGO，点击回到首页"/>
		<top-nav-wide v-if="$mediaMatch('desktop+')"/>
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
	props: {
		showBanner: {
			type: Boolean,
			default: false,
		},
		banner: {
			type: Object,
			required: false,
		},
	},
	computed: {
		navStyle () {
			const { banner } = this;
			if (banner) {
				return { "--background": `url(${banner.image})` };
			}
			return null;
		},
		navClass () {
			const { banner } = this;
			if (!banner) {
				return "default-banner";
			}
			switch (banner.theme) {
				case 1:
					return "light";
				case 2:
					return "dark";
				default:
					return null;
			}
		},
	},
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
	display: block;
	width: 240px;
	/*height: 100%;*/ // flex 容器下有问题

	background: url("../assets/img/Logo-Width.svg");
	background-size: 240px 200%;

	&:hover, &:focus {
		background-position: 0 100%;
	}
}

:global(.dark) .container {
	background-color: rgba(255, 255, 255, .1);
}
</style>
