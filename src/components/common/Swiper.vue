<template>
	<div class="swiper">
		<slot class="prev" :slide="prev"></slot>
		<slot class="current" :slide="slides[index]"></slot>
		<slot class="after" :slide="after"></slot>
	</div>
</template>

<script>
export default {
	name: "Swiper",
	props: ["options", "slides"],
	data() {
		return {
			index: 0,
		};
	},
	computed: {
		prev() {
			return this.index === 0 ? this.slides[this.slides.length - 1] : this.slides[this.index];
		},
		after() {
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

<style scoped>
.swiper{
	overflow: hidden;
	position: relative;
}

.prev, .after {
	position: absolute;
}

.prev {

}
</style>
