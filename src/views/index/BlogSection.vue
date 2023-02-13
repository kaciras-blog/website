<template>
	<section>
		<header :class='$style.header'>
			<h1 :class='$style.title'>推荐</h1>
			<KxButton
				type='outline'
				route='/list'
			>
				更多文章 >
			</KxButton>
		</header>

		<!-- 懒得再套一层 li 了没用 ul -->
		<div v-if='cards.length' :class='$style.card_list'>
			<SmartLink
				v-for='card of cards'
				:key='card.id'
				:href='card.link'
				:aria-label='card.name'
				:class='$style.figure'
			>
				<img
					:src='card.picture'
					alt='封面'
					:class='$style.picture'
				>
				<div :class='$style.meta'>
					<span :class='$style.category'>#TODO</span>
					2023-1-13
				</div>
				<h2 :class='$style.name'>
					{{ card.name }}
				</h2>
				<div :class='$style.content'>
					{{ card.description }}
				</div>
			</SmartLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { KxButton, SmartLink } from "@kaciras-blog/uikit";
import { usePrefetch } from "@/store";

const { cards } = usePrefetch().data;
</script>

<style module lang="less">
@import "../../css/imports";

.header {
	display: flex;
	align-items: center;
	margin-bottom: 2rem;
}

.title {
	margin: 0 auto 0 0;
	font-size: 1.75rem;
}

// ================================ Cards ================================

@pic-width: 368px;
@pic-height: @pic-width * 0.5625;

// 简介行数上限，超出显示省略号。
@max-lines: 6;

// 自动网格的卡片布局
// https://blog.kaciras.com/article/14/use-pure-CSS-to-implement-center+wrap+left-alignment-layout
.card_list {
	display: grid;
	justify-content: center;
	gap: 25px;

	// 左右各 5vw 间距，再乘以 0.75 比例，或者直接裁剪图片到指定比例？
	--pic-height: 50.625vw;
	--text-margin: 12px;

	@media screen and (min-width: @length-screen-mobile) {
		--pic-height: @pic-height;
		--text-margin: 16px;

		gap: 40px;
		grid-template-columns: repeat(auto-fit, @pic-width);
	}
}

// 博客上的图白底的多，擦亮动画效果不好，还是用浮起吧。
.figure {
	composes: clean-link from global;

	position: relative;
	overflow: hidden;

	border-radius: 12px;
	background: white;
	box-shadow: 0 8px 16px rgba(0, 0, 0, .1);

	@media screen and (min-width: @length-screen-mobile) {
		transition: .3s;
		font-size: 16px;

		&:hover, &:focus {
			transform: translateY(-4px);
			box-shadow: 0 14px 20px rgba(0, 0, 0, .2);
		}
	}
}

.picture {
	display: block;
	width: 100%;
	height: var(--pic-height);
}

.meta {
	position: absolute;
	width: 100%;
	height: 38px;
	top: calc(var(--pic-height) - 38px);

	display: none; // TODO: 等后端修改完再启用。
	//display: flex;
	padding: 24px var(--text-margin) 0 var(--text-margin);
	line-height: 1;
	font-size: 0.875em;

	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
}

.category {
	color: deeppink;
	margin-right: auto;
}

.name {
	margin: var(--text-margin);

	// 虽然浏览器默认 article 下的 h1 是这个大小，但还是写上保险些
	font-size: 1.17em;
	background: rgba(255, 255, 255, .8);
}

.content {
	box-sizing: content-box;
	margin: var(--text-margin);

	line-height: 1.6;
	height: @max-lines * 1.6em;

	.line-clamp(@max-lines);
}

@media screen and (max-width: @length-screen-mobile) {
	.header {
		margin-bottom: 25px;
	}

	.content {
		font-size: 14px;
	}
}
</style>
