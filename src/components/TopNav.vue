<template>
	<div :style="navStyle" :class="navClass">
		<div v-if="showBanner"
			 :class="[$style.filterContainer, $style.shadow]">
			<top-nav-wide/>
		</div>
		<top-nav-wide v-else :class="$style.shadow"/>
		<div v-if="showBanner" :class="$style.banner" role="banner"></div>
	</div>
</template>

<script>
import TopNavWide from "./TopNavWide";

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
};
</script>

<style module lang="less">
@import "../css/Imports.less";

.filterContainer {
	.glass;
	.glass.blur(4px);
	height: 50px;
}

.shadow {
	box-shadow: rgba(0, 0, 0, .2) 0 0 3px 1px;
}

.banner {
	height: 13rem;
	margin-top: -50px;
	margin-bottom: 4rem;
}

// 使用变量设置背景图，只要在外层元素设置即可
.filterContainer::before,
.banner {
	background: var(--background);
	background-size: var(--background-size); // 这个属性写一起毛病多

	@media screen and (min-width: @length-screen-pad) {
		background-size: var(--background-size, cover);
	}
}

:global(.dark) .navWrapper {
	box-shadow: rgba(0, 0, 0, .5) 0 0 3px 1px;
}
</style>
