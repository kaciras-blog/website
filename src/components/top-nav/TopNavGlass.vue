<template>
	<nav :class="$style.container">
		<!-- 为了动态接收传入的样式，不能用伪元素 -->
		<div :class="[$style.pseudo, imageClass]" :style="imageStyle"></div>
		<top-nav tag="div" class="full-vertex"/>
	</nav>
</template>

<script lang="ts">
import TopNav from "./TopNav.vue";

export default {
	name: "TopNavGlass",
	components: { TopNav },
	props: ["imageClass", "imageStyle"],
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
