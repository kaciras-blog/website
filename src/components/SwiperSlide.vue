<template>
	<figure class="swiper-slide">
		<img class="picture" :src="item.picture"/>
		<figcaption>
			<!--<h2>{{item.name}}</h2>-->
			<p class="desc">{{item.description}}</p>
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
	text-align: center;
	color: white;
}

.swiper-slide > figcaption {
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 3rem;

	transition: all .3s;

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
		background-color: rgba(0, 0, 0, 0.4);

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

.picture{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.desc{
	text-transform: none;

}
</style>
