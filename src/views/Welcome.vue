<template>
	<page-layout view-id="welcome-page">
		<section id="blog">
			<swiper class="ms" :slides="slides">
				<swiper-slide slot-scope="{ slide }" :item="slide"/>
			</swiper>
			<header>
				<h1 class="title">博客网站</h1>
				<router-link class="big outline button" to="/">去看看</router-link>
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

export default {
	name: "Welcome",
	components: { SwiperSlide },
	data() {
		return {
			slides: [],
		};
	},
	created() {
		api.recommend.swiper.get().then(slides => this.slides = slides);
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
