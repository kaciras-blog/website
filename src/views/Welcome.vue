<template>
	<page-layout view-id="welcome-page">
		<section id="blog">
			<kx-carousel class="ms" :items="slides">
				<swiper-slide slot-scope="{ slide }" :key="slide.tid" :item="slide"/>
			</kx-carousel>
			<header>
				<h1 class="title">博客网站</h1>
				<kx-button route="/test" class="big outline primary">去看看</kx-button>
			</header>
			<div class="others"></div>
		</section>
		<section id="im">
		</section>
	</page-layout>
</template>

<script>
import api from "../apis";
import SwiperSlide from "../components/SwiperSlide";
import KxCarousel from "../components/common/KxCarousel";

export default {
	name: "Welcome",
	components: { KxCarousel, SwiperSlide },
	data() {
		return {
			slides: [],
		};
	},
	created() {
		api.recommend.swiper.get().then(slides => {
			let counter = 0;
			slides.forEach(s => s.tid = ++counter);
			this.slides = slides;
		});
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

#welcome-page {
	margin-top: 4rem;
}

#blog {
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: auto 1fr;
	grid-template-areas: "slide summary"
						 "others others";
	grid-gap: 2rem;

	padding: 5rem 5rem 0;

	& > header{
		padding: 2rem 0;
		grid-area: summary;
		text-align: center;
	}
}

.others{
	grid-area: others;
}

.big {
	width: 30%;
	padding: .8rem 0;
	font-size: 1.3rem;
}
#im{
	display: none;
}

.ms {
	width: 32rem;
	height: 20rem;
}


.title{
	font-size: 3rem;
}
</style>
