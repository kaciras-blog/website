<template>
	<div class="swiper">
		<template v-if="slides.length === 0">
			<div class="slide">空空如也</div>
		</template>
		<template v-else>
			<div class="prev slide"><slot :slide="prev"/></div>
			<div class="current slide"><slot :slide="slides[index]"/></div>
			<div class="next slide"><slot :slide="next"/></div>
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
	},
	data() {
		return {
			index: 0,
		};
	},
	computed: {
		prev() {
			return this.index === 0 ? this.slides[this.slides.length - 1] : this.slides[this.index];
		},
		next() {
			return this.index === this.slides.length - 1 ? this.slides[0] : this.slides[this.index];
		},
	},
	mounted() {
		// setInterval(() => {
		// 	if(this.index === this.slides.length) {
		// 		this.index = 0;
		// 	} else {
		// 		this.index++;
		// 	}
		// }, 3000);
	},
};
</script>

<style lang="less">
.swiper{
	overflow: hidden;
	position: relative;

	.slide {
		position: absolute;
		width: 100%;
		height: 100%;
		transition: all 0.3s;
	}
}

.prev, .next {

}

.prev {
	left: -100%;
}
.next {
	left: 100%;
}
</style>
