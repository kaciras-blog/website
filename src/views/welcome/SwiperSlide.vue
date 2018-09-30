<template>
	<a v-if="isAbsoluteLink" :href="item.link">
		<img class="picture" :src="item.picture"/>
	</a>
	<router-link v-else class="swiper-slide" :to="item.link">
		<img class="picture" :src="item.picture"/>
	</router-link>
</template>

<script>
export default {
	name: "SwiperSlide",
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	computed: {
		isAbsoluteLink() {
			return /^(?:https?:|\/\/)/.test(this.item.link);
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImpoert";

.swiper-slide {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
}

.picture{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

</style>
