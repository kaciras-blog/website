<template functional>
	<div :style="navStyle" :class="navClass">
		<div :class="[$style.filterContainer, $style.shadow]">
			<top-nav/>
		</div>
		<div :class="$style.banner" role="banner"></div>
	</div>
</template>

<script>
export default {
	name: "NavWithBanner",
};
</script>

<style module lang="less">
@import "../css/Imports.less";

.filterContainer {
	.glass;
	.glass.blur(4px);
	height: 50px;
	box-shadow: rgba(0, 0, 0, .2) 0 0 3px 1px; // TODO: 不共用？
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
