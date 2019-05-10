<template>
	<section>

		<header :class="$style.header">
			<h1 :class="$style.title">文章</h1>
			<router-link
				to="/list"
				class="outline primary kx-btn">
				更多文章 >
			</router-link>
		</header>

		<ul v-if="slides" :class="$style.cardList" class="list">
			<li v-for="slide of slides" :key="slide.randomId">
				<post-card v-bind="slide"/>
			</li>
		</ul>
	</section>
</template>

<script>
import PostCard from "./PostCard";
import { mapState } from "vuex";

export default {
	name: "BlogSection",
	components: {
		PostCard,
	},
	computed: mapState({
		slides: state => state.prefetch.slides,
	}),
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
	grid-gap: 50px 20px;

	@media screen and (min-width: @length-screen-mobile) {
		justify-items: center;
	}
}
</style>
