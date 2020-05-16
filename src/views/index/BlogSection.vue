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

		<!-- 懒得再套一层 li 了没用 ul -->
		<div v-if="cards.length" :class="$style.card_list">
			<smart-link
				v-for="card of cards"
				:key="card.id"
				:href="card.link"
				class="clean-link"
			>
				<article :class="$style.figure">
					<div :class="$style.card_header">
						<img
							:src="card.picture"
							alt="封面"
							:class="$style.picture"
						>
						<h3 :class="$style.name"> {{card.name}} </h3>
					</div>
					<div :class="$style.content"> {{card.description}}</div>
				</article>
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
@import "../../css/imports";

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

// ================================ Cards ================================

@pic-width: 400px;
@pic-height: @pic-width * 0.75;

// 左右各5vw间距，再乘以0.75比例
// 或者直接裁剪图片到指定比例？
@pic-height-mobile: 63vw;

.card_list {
	display: grid;
	grid-auto-rows: auto;
	grid-gap: 40px;
	justify-content: center;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-columns: repeat(auto-fit, @pic-width);
	}
}

.figure {
	font-size: 16px;
	overflow: hidden;
	box-shadow: 0 8px 16px rgba(0, 0, 0, .15);
}

// 这个效果抄自：
// https://github.com/chanshiyucx/aurora/blob/master/src/views/Home/index.scss
.card_header {
	position: relative;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: hsla(0, 0%, 100%, .6);
		transition: transform .6s;
		z-index: 2;
		will-change: transform;
		transform: scale3d(1.9, 1.4, 1) rotate(45deg) translate3d(0, -120%, 0);
	}

	&:hover::before {
		transform: scale3d(1.9, 1.4, 1) rotate(45deg) translate3d(0, 120%, 0);
	}
}

.picture {
	width: 100%;
	height: @pic-height;

	@media screen and (max-width: @length-screen-mobile) {
		height: @pic-height-mobile;
	}
}

.name {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 0;
	padding: 16px;
	background: rgba(255, 255, 255, .8);
}

.content {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;

	margin: 16px;
	line-height: 1.5;
	height: 4.5em;
	box-sizing: content-box;
}
</style>
