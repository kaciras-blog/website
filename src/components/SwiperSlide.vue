<template>
	<figure class="swiper-slide">
		<img class="picture" :src="item.picture"/>
		<figcaption>
			<h2>{{item.name}}</h2>
			<p>{{item.description}}</p>
			<router-link :to="item.link"></router-link>
		</figcaption>
	</figure>
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
};
</script>

<style lang="less">
@import "../css/ToBeImpoert";

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
		background-color: rgba(0, 0, 0, 0.5);

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
