<template>
	<div class="swiper">
		<template v-if="slides.length === 0">
			<div class="slide">空空如也</div>
		</template>
		<template v-else>
			<div class="slide"
				 :class="{ 'fade-in': scrolling }"
				 :style="{ animationDuration: speed + 'ms' }">
				<slot :slide="next"/>
			</div>
			<div class="slide">
				<slot :slide="current"/>
			</div>

			<!-- 切换时点击跳到下一轮播的链接 -->
			<div v-if="scrolling" class="mask"><slot :slide="next"/></div>
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
		speed: {
			type: Number,
			default: 1000,
		},
	},
	data() {
		return {
			index: 0,
			scrolling: false,
		};
	},
	computed: {
		current() {
			return this.slides[this.index];
		},
		next() {
			const { slides, index } = this;
			return index === slides.length - 1 ? slides[0] : slides[index + 1];
		},
	},
	methods: {
		nextSlide() {
			const { index, slides, speed } = this;

			this.scrolling = true;

			return new Promise(resolve => setTimeout(() => {
				if (index === slides.length - 1) {
					this.index = 0;
				} else {
					this.index++;
				}
				this.scrolling = false;
				resolve();
			}, speed));
		},
	},
	mounted() {
		setInterval(this.nextSlide.bind(this), 4000 + this.speed);
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImpoert";

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
	from { opacity: 0 }
	to { opacity: 100% }
}
</style>
