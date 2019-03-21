<template>
	<div v-show="visible"
		 :class="$style.container"
		 @click="visible = false">

		<img :src="source"
			 alt="查看大图"
			 :class="$style.image">
	</div>
</template>

<script>
export default {
	name: "ImageViewer",
	data: () => ({
		visible: false,
		source: undefined,
	}),
	methods: {
		show (el) {
			this.source = el.src;
			this.visible = true;
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.container {
	.overlay-fixed;
	background-color: rgba(0, 0, 0, .5);
	z-index: 100;
}

.image {
	.center-absolute-auto;
	max-width: 100vw;
	max-height: 100vh;
	cursor: zoom-out;
}
</style>
