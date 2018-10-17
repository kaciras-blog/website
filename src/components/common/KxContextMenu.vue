<template>
	<div class="test-menu" :style="style">
		<div>菜单项1</div>
	</div>
</template>

<script>
export default {
	name: "KxContextMenu",
	props: {
		event: {},
	},
	data: () => ({
		style: {
			opacity: 0,
		},
	}),
	mounted () {
		const rect = this.$el.getBoundingClientRect();
		const { width, height } = rect;
		const { clientX, clientY } = this.event;

		function computePosition (mouse, length, limit) {
			if (mouse + length < limit) {
				return mouse;
			}
			const reverse = mouse - length;
			if (reverse > 0) {
				return reverse;
			}
			return mouse > limit / 2 ? reverse : mouse;
		}

		this.style = {
			position: "absolute",
			opacity: 1,
			top: computePosition(clientY, height, window.innerHeight) + "px",
			left: computePosition(clientX, width, window.innerWidth) + "px",
		};
	},
};
</script>

<style lang="less">
.test-menu {
	width: 175px;
	height: 500px;

	border: solid 1px black;
}
</style>
