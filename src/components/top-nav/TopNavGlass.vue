<template>
	<nav
		:class="[$style.container, data.class, data.staticClass]"
		:style="[data.style, data.staticStyle]"
	>
		<!-- 为了动态接收传入的样式，不能用伪元素 -->
		<div :class="[$style.pseudo, props.imageClass]" :style="props.imageStyle"></div>
		<top-nav-body tag="div" class="full-vertex"/>
	</nav>
</template>

<script>
export default {
	name: "TopNavGlass",
};
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	composes: top-nav from global;
	position: relative;
	height: var(--nav-height);
}

.pseudo {
	composes: full-vertex from global;
	filter: blur(4px)
}
</style>
