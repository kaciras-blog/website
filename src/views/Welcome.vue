<template>
	<page-layout view-id="welcome-page">
		<section id="blog">
			<swiper class="ms" :slides="slides">
				<swiper-slide slot-scope="{ slide }" :item="slide"/>
			</swiper>
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

<style lang="less">
@import "../css/ToBeImpoert";

#blog {
	padding: 5rem 5rem 0;
}

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
</style>
