<template>
	<div>
		<div :class="$style.navWrapper"><top-nav-wide/></div>
		<div v-if="banner" :class="$style.banner" role="banner"></div>
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

<style module lang="less">
@import "../css/Imports.less";

.navWrapper {
	.glass;
	.glass.blur(4px);

	position: absolute;
	z-index: 500;
	left: 0;
	right: 0;
	top: 0;
	height: 3rem;

	box-shadow: rgba(0, 0, 0, .2) 0 0 4px 2px;
}

.banner {
	height: 12rem;
	margin-bottom: 4rem;
}

// 使用变量设置背景图，只要在外层元素设置即可
.navWrapper::before,
.banner {
	background: var(--background, url("../assets/index-banner.jpg") center 0);
	background-size: var(--background-size); // 这个属性写一起毛病多

	@media screen and (min-width: @length-screen-pad) {
		background-size: var(--background-size, cover);
	}
}

:global(.dark) .navWrapper {
	box-shadow: rgba(0, 0, 0, .5) 0 0 4px 2px;
}
</style>
