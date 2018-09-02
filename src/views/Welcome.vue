<template>
	<swiper :options="swiperOption">
		<figure class="swiper-slide swiper-no-swiping" v-for="(slide, index) of slides" :key="index">
			<img :src="slide.picture"/>
			<figcaption>
				<h2>{{slide.name}}</h2>
				<p>{{slide.description}}</p>
				<router-link :to="slide.link"></router-link>
			</figcaption>
		</figure>
		<div class="swiper-pagination" slot="pagination"></div>
	</swiper>
</template>

<script>
import Vue from "vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
import api from "../apis";

Vue.use(VueAwesomeSwiper);

export default {
	name: "Welcome",
	data() {
		return {
			swiperOption: {
				autoplay: {
					disableOnInteraction: false,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
			},
			slides: [],
		};
	},
	created() {
		api.recommend.swiper.get().then(slides => this.slides = slides);
	},
};
</script>

<style lang="less">
@import "../css/ToBeImpoert";

#welcome-page {
	margin-top: 3rem;
}

.swiper-container {
	width: 32rem;
	height: 20rem;
}

.swiper-slide {
	& > figcaption {
		& > a {
			z-index: 3;
			position: absolute;
			.full-vertex
		}

		&::before, &::after {
			position: absolute;
			content: '';
			opacity: 0;
			transition: all 0.35s;
		}

		&:hover {
			&::before, &::after {
				opacity: 1;
				-webkit-transform: scale(1);
				transform: scale(1);
			}
		}

		&::before {
			top: 50px;
			right: 30px;
			bottom: 50px;
			left: 30px;

			border-top: 1px solid #fff;
			border-bottom: 1px solid #fff;

			-webkit-transform: scale(0, 1);
			transform: scale(0, 1);

			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
		}
		&::after {
			top: 30px;
			right: 50px;
			bottom: 30px;
			left: 50px;
			border-right: 1px solid #fff;
			border-left: 1px solid #fff;

			-webkit-transform: scale(1, 0);
			transform: scale(1, 0);

			-webkit-transform-origin: 100% 0;
			transform-origin: 100% 0;
		}
	}
}
</style>
