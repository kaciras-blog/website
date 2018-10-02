<template>
	<div class="swiper">
		<template v-if="slides.length">
			<div class="slide"
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
	name: "Swiper",
	props: {
		slides: {
			type: Array,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
		speed: {
			type: Number,
			default: 1000,
		},
	},
	data() {
		return {
			current: this.index,
			next: 0,
			scrolling: false,
		};
	},
	// computed: {
	// 	current() {
	// 		return this.slides[this.index];
	// 	},
	// 	next() {
	// 		const { slides, index } = this;
	// 		return index === slides.length - 1 ? slides[0] : slides[index + 1];
	// 	},
	// },
	watch: {
		index(nv, ov) {
			this.scrolling = true;
			this.next = nv;
			this.current = ov;

			setTimeout(() => {
				this.current = nv;
				this.scrolling = false;
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
