<template>
	<section>
		<header :class="$style.header">
			<h1 :class="$style.title">文章</h1>
			<router-link
				to="/list"
				class="outline primary kx-btn"
			>
				还有更多 >
			</router-link>
		</header>

		<!-- 因为 figure 也是单个容器元素，懒得再套一层 li 了，所以没用 ul -->
		<div v-if="cards.length" :class="$style.card_list">
			<smart-link
				v-for="card of cards"
				:key="card.id"
				:href="card.link"
				class="clean-link"
				:class="$style.card_link"
			>
				<figure :class="$style.figure">
					<img
						:src="card.picture"
						alt="封面"
						:class="$style.image"
					>
					<figcaption :class="$style.content">
						<h2>{{card.name}}</h2>
						<span class="loose">{{card.description}}</span>
					</figcaption>
				</figure>
			</smart-link>
		</div>

	</section>
</template>

<script>
import { mapState } from "vuex";
import SmartLink from "./SmartLink";

export default {
	name: "BlogSection",
	components: {
		SmartLink,
	},
	computed: mapState({
		cards: state => state.prefetch.cards,
	}),
};
</script>

<style module lang="less">
@import "../../css/Imports";

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2rem 0;
}

.title {
	margin: 0;
	font-size: 30px;
}

.card_list {
	display: grid;
	grid-auto-rows: auto;
	grid-gap: 50px 20px;
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-columns: 1fr 1fr;
	}
	@media screen and (min-width: @length-screen-pad) {
		grid-template-columns: 1fr 1fr 1fr;
	}
}

@media screen and (max-width: @length-screen-mobile) {
	.card_link {
		width: 100%;
		max-width: 500px;
	}
}

.figure {
	margin: 0;

	border-radius: 8px;
	box-shadow: 0 2px 3px rgba(10, 10, 10, .1),
	0 0 0 1px rgba(10, 10, 10, .1);
	font-size: 16px;
	overflow: hidden;

	@media screen and (min-width: @length-screen-mobile) {
		width: 320px;
		height: 480px;
	}
}

.image {
	width: 100%;
	height: 250px;

	@media screen and (max-width: @length-screen-mobile) {
		height: 65vw;
	}
}

.content {
	padding: 20px;
}
</style>
