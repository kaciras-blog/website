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

		<ul v-if="slides" :class="$style.cardList">
			<post-card v-for="slide of slides" :key="slide.randomId" v-bind="slide"/>
		</ul>
	</section>
</template>

<script>
import PostCard from "./PostCard";
import api from "../../api";
import { attachRandomId } from "../../utils";

export default {
	name: "BlogSection",
	components: { PostCard },
	data: () => ({
		slides: null,
	}),
	beforeMount() {
		api.recommend.swiper.get().then(slides => this.slides = slides.map(attachRandomId));
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

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

.cardList {
	display: grid;
	padding: 0 5vw;
	width: 100%;

	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	grid-auto-rows: auto;
	justify-items: center;
	grid-gap: 50px 20px;
}
</style>
