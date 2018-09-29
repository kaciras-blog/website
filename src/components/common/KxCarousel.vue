<template>
	<div class="kx-carousel">
		<swiper :slides="items" :index="index">
			<template slot-scope="{ slide }">
				<slot :slide="slide"/>
			</template>
		</swiper>

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
			default: 800,
		},
	},
	data: () => ({
		index: 0,
	}),
	methods: {
		nextSlide() {
			const { index, items } = this;
			if (index === items.length - 1) {
				this.index = 0;
			} else {
				this.index++;
			}
		},
		switchTo(i) {
			this.index = i;
		},
	},
	mounted() {
		setInterval(this.nextSlide.bind(this), this.duration + this.animation);
	},
};
</script>

<style lang="less">
.kx-carousel {
	position: relative;
}
</style>
