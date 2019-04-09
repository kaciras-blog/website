<template>
	<div :class="$style.progress" :style="style"></div>
</template>

<script>
const TRANSITION_TIME = 300;
const RESIDUAL_TIME = 800;

export default {
	name: "TopProgressBar",
	data: () => ({
		visible: false,
		hasError: false,
		progress: 0,
	}),
	computed: {
		style() {
			return {
				opacity: this.visible ? 1 : 0,
				backgroundColor: this.hasError ? "#ff4d4d" : "#1a9fff",
				"--progress": this.progress,
			};
		},
	},
	methods: {
		start() {
			if (this.visible) {
				return; // 忽略重复调用
			}
			this.progress = 30;
			this.visible = true;
			this.hasError = false;
		},
		middle() {
			if (!this.visible) {
				this.start();
			}
			this.progress = 70;
		},

// ============================ 结束方法 ============================

		finish() {
			if (!this.visible) {
				return; // 必须先调用启动方法
			}
			this.progress = 100;

			setTimeout(() => {
				this.visible = false;
				setTimeout(() => this.progress = 0, TRANSITION_TIME);
			}, RESIDUAL_TIME);
		},
		error() {
			if (!this.visible) {
				return;
			}
			this.progress = 100;
			this.hasError = true;

			setTimeout(() => {
				this.visible = false;
				setTimeout(() => this.progress = 0, TRANSITION_TIME);
			}, RESIDUAL_TIME);
		},
	},
};
</script>

<style module lang="less">
.progress {
	position: fixed;
	top: 0;
	left: 0;
	width: calc(var(--progress) * 1%);
	height: 3px;
	z-index: 99999;
	transition: .3s;

	&::before {
		content: '';
		position: absolute;
		width: 40px;
		height: 100%;

		background-image: linear-gradient(
			90deg,
			transparent 0,
			rgba(255, 255, 255, .8) 60%,
			transparent 100%);

		animation: highlight linear calc(50ms * var(--progress)) infinite;
	}
}

//@formatter:off
@keyframes highlight {
	from { right: 100%; }
	to { right: 0 }
}
</style>
