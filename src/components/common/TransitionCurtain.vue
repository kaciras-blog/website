<template>
	<transition name="fade">
	<div class="dimmer" v-show="show">
		<div class="loading">
			<sk-fading-circle/>
			<span v-if="timeouted">10秒都没加载完，多半是废了，您可以继续等等，或是<a @click="cancel">取消</a></span>
			<span v-else>加载中...</span>
		</div>
	</div>
	</transition>
</template>

<script>
export default {
	name: "TransitionCurtain",
	props: {
		timeout: {
			type: Number,
			default: 10 * 1000,
		},
	},
	data() {
		return {
			show: false,
			timeouted: false,
		};
	},
	methods: {
		start() {
			this.show = true;
			this._timer = setTimeout(() => this.timeouted = true, this.timeout);
		},
		finish() {
			clearTimeout(this._timer);
			this.show = false;
			this.timeouted = false;
		},
		cancel() {
			this.finish();
			this.$emit("canceled");
		},
	},
	destroyed() {
		clearTimeout(this._timer);
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.dimmer {
	.overlay-fixed;
	z-index: 1000;
	background-color: rgba(255, 255, 255, 0.6);
}

.loading {
	.center-absolute(12rem, 10rem);
	border-radius: .5rem;
	padding: 1rem;
	background-color: #494949;
	color: white;
	--color: #ff7dd0;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
