<template>
	<BasePageLayout :nav-class='navClass' :nav-style='navStyle'>
		<template v-if='$bp.isGreater("tablet")' v-slot:nav>
			<TopNav :class='desktopNavClass'/>
			<div :class='$style.banner' :style='desktopNavStyle' role='banner'/>
		</template>

		<slot></slot>
	</BasePageLayout>
</template>

<script>
import BasePageLayout from "./BasePageLayout.vue";
import TopNav from "./top-nav/TopNav.vue";

export default {
	name: "BannerPageLayout",
	components: {
		TopNav,
		BasePageLayout,
	},
	props: {
		banner: {
			type: Object,
			required: false,
		},
		navClass: {},
		navStyle: {},
	},
	computed: {
		desktopNavStyle() {
			const { banner } = this;
			if (banner) {
				return { "--background": `url(${banner.image})` };
			}
			return null;
		},
		// 好像没用了
		desktopNavClass() {
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
};
</script>

<style module lang="less">
@import "../css/imports";

// 使用变量设置背景图，只要在外层元素设置即可
.banner {
	min-height: 211px;
	height: 11vw;
	margin-top: -@nav-height;

	background: var(--background);
	background-size: var(--background-size); // 这个属性写一起毛病多

	@media screen and (min-width: @length-screen-pad) {
		background-size: var(--background-size, cover);
	}
}
</style>
