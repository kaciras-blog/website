<template>
	<div>
		<top-nav-wide/>
		<div v-if="banner" class="banner" role="banner"></div>
	</div>
</template>

<script>
import TopNavWide from "./TopNavWide";

export default {
	name: "TopNav",
	components: { TopNavWide },
	props: {
		banner: {
			type: Boolean,
			default: false,
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
	box-shadow: rgba(0, 0, 0, 0.4) 0 0 4px 2px;
}

.banner {
	height: 12rem;
	margin-bottom: 4rem;
}

#top-nav::before, .banner {
	background: var(--background);
	background-size: var(--background-size); // 这个属性写一起毛病多
}

.default-banner {
	--background: url("../assets/index-banner.jpg") center 0;

	@media screen and (min-width: @length-screen-pad) {
		--background-size: cover;
	}
}
</style>
