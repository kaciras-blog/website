<template>
	<section>
		<header :class="$style.header">
			<h1 :class="$style.title">推荐</h1>
			<router-link
				to="/list"
				class="outline primary kx-btn"
			>
				更多文章 >
			</router-link>
		</header>

		<!-- 懒得再套一层 li 了没用 ul -->
		<div v-if="cards.length" :class="$style.card_list">
			<smart-link
				v-for="card of cards"
				:key="card.id"
				:href="card.link"
				:aria-label="card.name"
				class="clean-link"
				:class="$style.figure"
			>
				<article>
					<div :class="$style.card_header">
						<img
							:src="card.picture"
							alt="封面"
							:class="$style.picture"
						>
						<h1 :class="$style.name">{{card.name}} </h1>
					</div>
					<div :class="$style.content">{{card.description}}</div>
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

	margin-bottom: 2rem;
}

.title {
	margin: 0;
	font-size: 2rem;
}

// ================================ Cards ================================

@pic-width: 400px;
@pic-height: @pic-width * 0.75;

// 左右各5vw间距，再乘以0.75比例
// 或者直接裁剪图片到指定比例？
@pic-height-mobile: 63vw;

// 自动网格的卡片布局
// https://blog.kaciras.com/article/14/use-pure-CSS-to-implement-center+wrap+left-alignment-layout
.card_list {
	display: grid;
	grid-gap: 40px;
	justify-content: center;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-columns: repeat(auto-fit, @pic-width);
	}
}

// 博客上的图还是白底的多，擦亮动画效果不好，还是用放大吧
.figure {
	font-size: 16px;
	overflow: hidden;
	box-shadow: 0 3px 6px rgba(0, 0, 0, .2);

	@media screen and (min-width: @length-screen-mobile) {
		transition: .4s;

		&:hover, &:focus {
			transform: translateY(-5px);
			box-shadow: 0 10px 16px rgba(0, 0, 0, .25);
		}
	}
}

.card_header {
	position: relative;
	overflow: hidden;
}

.picture {
	display: block;
	width: 100%;
	height: @pic-height-mobile;

	@media screen and (min-width: @length-screen-mobile) {
		height: @pic-height;
	}
}

.name {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;

	margin: 0;

	// 虽然浏览器默认 article 下的 h1 是这个大小，但还是写上保险些
	font-size: 1.17em;


	padding: 14px;
	background: rgba(255, 255, 255, .8);
}

.content {
	margin: 14px;
	line-height: 1.5;
	height: 4.5em;
	box-sizing: content-box;

	.line-clamp(3);
}

@media screen and (max-width: @length-screen-mobile) {
	.header {
		margin-bottom: 25px;
	}

	// 卡片下面阴影较大，需要更大的间隔才能看起来跟左右一致
	.card_list {
		grid-gap: 16px;
	}

	.name {
		padding: 10px;
	}

	.content {
		margin: 10px;
		font-size: 14px;
	}
}
</style>
