<template>
	<page-layout view-id="welcome-page">
		<swiper class="ms" :slides="slides">
			<figure class="swiper-slide" slot-scope="{ slide }">
				<img class="picture" :src="slide.picture"/>
				<figcaption>
					<h2>{{slide.name}}</h2>
					<p>{{slide.description}}</p>
					<router-link :to="slide.link"></router-link>
				</figcaption>
			</figure>
		</swiper>
	</page-layout>
</template>

<script>
import api from "../apis";

export default {
	name: "Welcome",
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

<style lang="less">
@import "../css/ToBeImpoert";

#welcome-page {
	margin-top: 3rem;
}

.ms {
	width: 32rem;
	height: 20rem;
	border: solid 1px black;
}
.picture{
	position: absolute;
	width: 100%;
	height: 100%;
}
.swiper-slide {
	margin: 0;
}
.swiper-slide > figcaption {
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
</style>
