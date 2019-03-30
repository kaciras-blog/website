<template>
	<div :class="$style.progress" :style="style"></div>
</template>

<script>
export default {
	name: "TransitionCurtain2",
	data: () => ({
		visible: true,
		hasError: false,
		progress: 20,
	}),
	computed: {
		style () {
			return {
				opacity: this.visible ? 1 : 0,
				backgroundColor: this.hasError ? "red" : "#f50bc7",
				left: 0,
				width: this.progress + "%",
			};
		},
	},
	methods: {
		start () {
			if (this.visible) {
				return; // 忽略重复调用
			}
			this.progress = 20;
			this.visible = true;
			this.hasError = false;
		},
		finish () {
			this.progress = 100;

			setTimeout(() => {
				this.visible = false;
				setTimeout(() => this.progress = 0, 200);
			}, 200);
		},
		error () {
			this.progress = 100;
			this.hasError = true;

			setTimeout(() => {
				this.visible = false;
				setTimeout(() => this.progress = 0, 200);
			}, 200);
		},
	},
};
</script>

<style module lang="less">
.progress {
	position: fixed;
	top: 0;
	height: 3px;
	z-index: 99999;
	transition: linear .3s;

	/*&::after {*/
		/*content: "";*/
		/*float: right;*/
		/*width: 6px;*/
		/*height: 3px;*/
		/*background-color: #f70ccc;*/
		/*box-shadow: 0 0 3px 1px #ff80e8;*/
	/*}*/
}
</style>
