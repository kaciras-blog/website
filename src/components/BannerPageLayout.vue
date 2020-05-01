<template>
	<base-page-layout :nav-class="navClass" :nav-style="navStyle">

		<template v-if="$mediaQuery.match('tablet+')" v-slot:nav>
			<div :style="desktopNavStyle" :class="desktopNavClass">
				<top-nav-glass :image-class="$style.image_resolver"/>
				<div :class="$style.banner" role="banner"></div>
			</div>
		</template>

		<slot></slot>
	</base-page-layout>
</template>

<script>
export default {
	name: "BannerPageLayout",
	props:{
		banner: {
			type: Object,
			required: false,
		},
		navClass: {},
		navStyle: {},
	},
	computed: {
		desktopNavStyle () {
			const { banner } = this;
			if (banner) {
				return { "--background": `url(${banner.image})` };
			}
			return null;
		},
		desktopNavClass () {
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
@import "../css/Imports.less";

// 使用变量设置背景图，只要在外层元素设置即可
.image_resolver {
	background: var(--background);
	background-size: var(--background-size); // 这个属性写一起毛病多

	@media screen and (min-width: @length-screen-pad) {
		background-size: var(--background-size, cover);
	}
}

.banner {
	composes: image_resolver;
	height: 12rem;
	margin-top: -50px;
}

:global(.dark) .navWrapper {
	box-shadow: rgba(0, 0, 0, .5) 0 0 3px 1px;
}
</style>
