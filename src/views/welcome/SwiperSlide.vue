<template>
	<a v-if="isAbsoluteLink"
	   :class="$style.slide"
	   :href="item.link">
		<img :class="$style.img" :src="item.picture"/>
	</a>
	<router-link
		v-else
		:class="$style.slide"
		:to="item.link">
		<img :class="$style.img" :src="item.picture"/>
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

<style module lang="less">
@import "../../css/ToBeImpoert";

.slide {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
}

.img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
