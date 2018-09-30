<template>
	<page-layout view-id="welcome-page">
		<section id="blog">
			<header>
				<h1 class="title">博客网站</h1>
				<kx-button route="/test" class="big outline primary">去看看</kx-button>
			</header>

			<sk-fading-circle v-if="loading"/>
			<kx-carousel v-else class="ms" :items="slides">
				<swiper-slide slot-scope="{ slide }" :key="slide.tid" :item="slide"/>
			</kx-carousel>

			<div class="others"></div>
		</section>
		<section id="im">
			<header>
				<h1>网页即时通信</h1>
			</header>
		</section>
	</page-layout>
</template>

<script>
import api from "../../api";
import SwiperSlide from "./SwiperSlide";

export default {
	name: "Welcome",
	components: { SwiperSlide },
	data: () => ({
		loading: true,
		slides: [],
	}),
	created() {
		api.recommend.swiper.get().then(slides => {
			let counter = 0;
			slides.forEach(s => s.tid = ++counter);
			this.slides = slides;
			this.loading = false;
		});
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

#welcome-page {
	margin-top: 4rem;
}

#blog {
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: auto 1fr;
	grid-template-areas: "slide header" "others others";
	grid-gap: 2rem;

	padding: 6rem 5rem 0;

	& > header {
		padding: 4rem 0;
		grid-area: header;
		text-align: center;
	}
}

.others {
	grid-area: others;
}

.big {
	width: 30%;
	padding: .8rem 0;
	font-size: 1.3rem;
}

#im {
	display: none;
	padding: 5rem;

	color: white;
	background-color: #0093ee;
}

.ms {
	width: 32rem;
	height: 20rem;
}

.title {
	font-size: 3rem;
}
</style>
