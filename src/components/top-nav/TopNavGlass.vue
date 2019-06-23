<template functional>
	<div :class="[$style.container, data.class, data.staticClass]"
		 :style="[data.style, data.staticStyle]">

		<!-- 为了动态接收传入的样式，不能用伪元素 -->
		<div :class="[$style.pseudo, props.imageClass]" :style="props.imageStyle"></div>
		<top-nav :class="$style.nav"/>
	</div>
</template>

<script>
export default {
	name: "TopNavGlass",
};
</script>

<style module lang="less">
@import "../../css/Imports.less";

.container {
	position: relative;
	width: 100%;
	height: 50px;
}

.pseudo {
	position: absolute;
	.margin-abs(0);
	filter: blur(4px)
}

// 使用绝对定位使其在伪元素上面
.nav {
	position: absolute;
}
</style>
