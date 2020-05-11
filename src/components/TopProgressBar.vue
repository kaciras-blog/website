<template>
	<div :class="[$style.progress, {[$style.error]: hasError}]" :style="style"></div>
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
		transition: true,
	}),
	computed: {
		style() {
			return {
				opacity: this.visible ? 1 : 0,
				"--progress": this.progress,
				transition: this.transition ? `width ease-out ${TRANSITION_TIME}ms` : undefined,
			};
		},
	},
	methods: {
		start() {
			if (this.visible) {
				return; // 忽略重复调用
			}
			this.progress = 0;
			this.visible = true;
			this.hasError = false;
		},
		setProgress(percent) {
			if (!this.visible) {
				this.start();
			}
			this.progress = percent;
		},

		/** 重置到进度为0并且不显示的状态，该过程是立即的没有动画 */
		reset() {
			this.transition = false;
			this.progress = 0;
			this.visible = false;
			this.$nextTick(() => this.transition = true);
		},
		finish() {
			if (!this.visible) {
				return; // 必须先调用启动方法
			}
			this.progress = 100;
			this._fadeout();
		},
		fail() {
			if (!this.visible) {
				return;
			}
			this.progress = 100;
			this.hasError = true;
			this._fadeout();
		},
		_fadeout() {
			setTimeout(() => {
				this.visible = false;
				setTimeout(this.reset, TRANSITION_TIME);
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
	height: 2px;

	z-index: 99999;
	background: #0064e6;

	&::before {
		content: '';
		position: absolute;
		width: 100px;
		height: 100%;

		background-image: linear-gradient(
			90deg,
			transparent 0,
			rgba(255, 255, 255, .7) 20%,
			#FFF 60%,
			transparent 100%
		);

		// 恒定时间
		animation: highlight linear calc(50ms * var(--progress)) infinite;
	}
}

.error {
	background: #f74343;
}

//@formatter:off
@keyframes highlight {
	from { right: 100%; }
	to { right: 0 }
}
</style>
