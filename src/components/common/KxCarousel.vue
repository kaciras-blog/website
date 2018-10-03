<template>
	<div class="kx-carousel">
		<fade-carousel
			:slides="items"
			:index="index"
			:speed="animation"
			@mouseenter.native="handleEnter"
			@mouseleave.native="handleLeave">

			<template slot-scope="{ slide }">
				<slot :slide="slide"/>
			</template>
		</fade-carousel>

		<carousel-pagination
			:items="items"
			:index="index"
			@click="switchTo"/>
	</div>
</template>

<script>
import CarouselPagination from "./CarouselPagination";

export default {
	name: "KxCarousel",
	components: { CarouselPagination },
	props: {
		items: {
			type: Array,
			required: true,
		},
		duration: {
			type: Number,
			default: 4000,
		},
		animation: {
			type: Number,
			default: 1000,
		},
		stopOnHover:{
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		index: 0,
	}),
	methods: {
		nextSlide() {
			const { index, items } = this;
			if (index === items.length - 1) {
				this.switchTo(0);
			} else {
				this.switchTo(index + 1);
			}
		},
		switchTo(i) {
			clearTimeout(this.$_timer);
			this.index = i;
			this.startTimer();
		},
		handleEnter() {
			if(this.stopOnHover) {
				clearTimeout(this.$_timer);
			}
		},
		handleLeave() {
			if(this.stopOnHover) {
				this.startTimer();
			}
		},
		startTimer() {
			this.$_timer = setTimeout(() => this.nextSlide(), this.duration + this.animation);
		},
	},
	mounted() {
		this.startTimer();
	},
};
</script>

<style lang="less">
.kx-carousel {
	position: relative;
}
</style>
