<template>
	<div class="swiper">

	</div>
</template>

<script>
export default {
	name: "Swiper",
	props: ["options"],
	data() {
		return {
			prev: null,
			current: null,
			after: null,
			slides: [],
		};
	},
	mounted() {

	},
};
</script>

<style scoped>

</style>
