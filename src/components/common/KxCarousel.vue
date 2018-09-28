<template>
	<div class="kx-carousel">
		<swiper :slides="items">
			<template slot-scope="{ slide }"><slot :slide="slide"/></template>
		</swiper>
		<carousel-pagination :items="items"/>
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
	},
};
</script>

<style lang="less">
.kx-carousel {
	position: relative;
}
</style>
