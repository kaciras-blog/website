<template>
	<div>
		<top-nav-wide/>
		<div v-if="props.showBanner" class="banner" role="banner"></div>
	</div>
</template>

<script>
import TopNavWide from "./TopNavWide";

export default {
	name: "TopNav",
	components: { TopNavWide },
	props: {
		theme: [Number, String],
		showBanner: {
			type: Boolean,
			default: false,
		},
		banner: {
			type: Object,
			default: () => ({
				theme: 0,
				image: require("../assets/index-banner.jpg"),
			}),
		},
	},
};
</script>

<style lang="less">
@import "../css/Imports.less";

#top-nav {
	.glass;
	.glass.blur(4px);

	position: absolute;
	z-index: 500;
	left: 0;
	right: 0;
	top: 0;
	height: 3rem;
	box-shadow: rgba(100, 100, 100, 0.2) 0 0 3px 2px;
}

.dark #top-nav {
	box-shadow: rgba(0, 0, 0, 0.3) 0 0 3px 2px;
}

.banner {
	height: 12rem;
	margin-bottom: 4rem;
}

#top-nav::before, .banner {
	background: var(--background);
	background-size: var(--background-size); // 这个属性写一起毛病多
}
</style>

<style module lang="less">
@import "../css/Imports.less";

.head {
	margin: 0 .5rem;
}

.content {
	position: relative;
	display: flex;
	justify-content: space-between;

	padding: 0 1rem;
	.full-percent;

	background-color: rgba(255, 255, 255, 0.4);

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 0 5%;
		}
	}
}

:global(.dark) .content {
	background-color: rgba(0, 0, 0, 0.15);
}
</style>
