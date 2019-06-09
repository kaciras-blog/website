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

		<ul v-if="slides"
			class="list"
			:class="$style.card_list"
		>
			<li v-for="card of slides"
				:key="card.randomId"
			>
				<auto-link
					:href="card.link"
					class="clean-link"
				>
					<post-card v-bind="card"/>
				</auto-link>
			</li>
		</ul>

	</section>
</template>

<script>
import PostCard from "./PostCard";
import { mapState } from "vuex";
import AutoLink from "./AutoLink";

export default {
	name: "BlogSection",
	components: {
		AutoLink,
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

.card_list {
	display: grid;
	padding: 0 5vw;

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
</style>
