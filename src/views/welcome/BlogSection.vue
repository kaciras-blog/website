<template>
	<section>

		<header :class="$style.header">
			<h1 :class="$style.title">编程开发</h1>
			<router-link
				to="/list"
				class="outline primary kx-btn">
				更多文章 >
			</router-link>
		</header>

		<!--<sk-fading-circle v-if="loading"/>-->

		<!--<kx-carousel v-else-->
			<!--:class="$style.carousel"-->
			<!--:items="slides"-->
			<!--:stop-on-hover="true"-->
		<!--&gt;-->
			<!--<swiper-slide v-slot="{ slide }" :key="slide.tid" :item="slide"/>-->
		<!--</kx-carousel>-->

		<div :class="$style.others"></div>
	</section>
</template>

<script>
export default {
	name: "BlogSection",
};
</script>

<style module lang="less">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2rem 5vw;
}

.title {
	font-size: 30px;
	margin: 0;
}
</style>
