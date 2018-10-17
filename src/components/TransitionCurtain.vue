<template>
	<transition name="fade">
		<div class="dimmer" v-show="show" tabindex="-1" @keyup.esc="cancel">
			<div class="loading">
				<sk-fading-circle v-if="!hasError"/>

				<div v-if="hasError">
					<p class="tc-err">加载出错</p>
					<p>可能是网络连接失败，或者服务器炸了</p>
				</div>
				<span v-else-if="timeouted">
					10秒都没加载完，多半是废了，您可以继续等等，或是
				</span>
				<span v-else>加载中...</span>

				<a class="highlight" @click="cancel">取消</a>
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
	data: () => ({
		show: false,
		timeouted: false,
		hasError: false,
	}),
	methods: {
		start () {
			if (this.show) {
				return; // 忽略重复调用，下同
			}
			this.show = true;
			this.$_timer = setTimeout(() => this.timeouted = true, this.timeout);
			this.$nextTick(() => this.$el.focus());
		},
		finish () {
			if (!this.show) {
				return;
			}
			clearTimeout(this.$_timer);
			this.show = false;
			this.timeouted = false;
			this.hasError = false;
		},
		error () {
			this.hasError = true;
		},
		cancel () {
			this.finish();
			this.$emit("canceled");
		},
	},
	destroyed () {
		clearTimeout(this.$_timer);
	},
};
</script>

<style scoped lang="less">
@import "../css/Imports";

.dimmer {
	.overlay-fixed;
	z-index: 1000;
	background-color: rgba(255, 255, 255, 0.6);
}

.tc-err {
	font-size: 1.5em;
	margin-top: .5em;
}

.loading {
	.center-absolute(12rem, 10rem);
	padding: 1rem;

	border-radius: .5rem;
	text-align: center;

	background-color: #494949;
	color: white;
	--fading-circle-color: @color-second;
}

.highlight {
	color: @color-second;
}
</style>
