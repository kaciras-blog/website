<template>
	<div class="swiper">
		<template v-if="slides.length">
			<div class="slide"
				 ref="test"
				 :class="{ 'fade-in': scrolling }"
				 :style="{ animationDuration: speed + 'ms' }">
				<slot :slide="slides[next]"/>
			</div>
			<div class="slide">
				<slot :slide="slides[current]"/>
			</div>

			<!-- 切换时点击跳到下一轮播的链接 -->
			<div v-if="scrolling" class="mask">
				<slot :slide="slides[next]"/>
			</div>
		</template>

		<template v-else>
			<div class="slide"><span>空空如也</span></div>
		</template>
	</div>
</template>

<script>
export default {
	name: "FadeCarousel",
	props: {
		slides: Array,
		index: Number,
		speed: Number,
	},
	data () {
		return {
			current: this.index,
			next: 0,
			scrolling: false,
		};
	},
	watch: {
		index (nv, ov) {
			const startFade = () => {
				this.$refs.test.offsetHeight;
				this.scrolling = true;
				this.next = nv;
				this.current = ov;
			};

			if (this.scrolling) {
				clearTimeout(this.$_timer);
				this.current = nv;
				this.scrolling = false;
				this.$nextTick(startFade);
			} else {
				startFade();
			}

			this.$_timer = setTimeout(() => {
				this.current = nv;
				this.scrolling = false;
				this.$emit("switched");
			}, this.speed);
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

.swiper {
	position: absolute;
	.margin-abs(0);
	overflow: hidden;

	.slide {
		position: absolute;
		width: 100%;
		height: 100%;
	}
}

.mask {
	opacity: 0;
}

.fade-in {
	z-index: 2;
	animation: s8 linear;
}

@keyframes s8 {
	from {
		opacity: 0
	}
	to {
		opacity: 100%
	}
}
</style>
