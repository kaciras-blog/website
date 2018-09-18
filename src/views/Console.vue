<template>
	<main id="console-page">
		<aside id="tabs" role="tablist" class="flex vertical compact">
			<h1>控制台</h1>
			<router-link role="tab" to="article">文章列表</router-link>
			<router-link role="tab" to="draft">我的草稿</router-link>
			<router-link role="tab" to="swiper">轮播</router-link>
			<router-link role="tab" to="category">管理分类</router-link>
			<router-link role="tab" to="config">选项</router-link>
		</aside>

		<nav id="nav-bar" class="light nav-item-group">
			<router-link to="/" class="nav-item">返回首页</router-link>
		</nav>
		<router-view class="content-body"/>
	</main>
</template>

<script>
import {FullScreen} from "../mixins";

export default {
	name: "Console",
	mixins: [FullScreen],
	created() {
		this.$emit("layout-changed", { show: false }, false);
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

#console-page {
	height: 100%;

	display: grid;
	grid-template-areas: "menu nav" "menu content";
	grid-template-columns: 12rem 1fr;
	grid-template-rows: 3rem 1fr;
}

#nav-bar {
	text-align: right;
	padding: 0 1rem;
	min-height: 3rem; // 谷歌的浏览器不能用height，必须用min-height
	color: @color-nav;
	background-color: @color-nav-background;
	border-bottom: solid 1px #c9c9c9;
	box-shadow: 0 0 @length-border-shadow 1px fade(@color-border, 30%);
	z-index: 1;
}

.content-body {
	grid-area: content;
	overflow-y: scroll;
	padding: 2rem;
}

#app {
	height: 100%;
}

#tabs {
	padding-top: 1rem;
	grid-area: menu;

	background-color: #1f2126;
	height: 100%;
	color: #dfdfdf;
	text-align: center;
	z-index: 2; // 盖住导航栏的阴影

	& > a {
		display: block;
		font-size: 1rem;
		cursor: pointer;
		background-color: transparent;
		border: none;
		padding: .6rem;
		color: #dfdfdf;
		transform: rotateZ(0);
		text-decoration: none;

		&:hover, &:focus {
			background-color: #3d414b;
		}
	}

	& .router-link-active::after {
		content: "";
		position: absolute;
		top: 50%;
		right: 0;
		margin-top: -.8rem;

		width: 0;
		height: 0;
		border: .8rem solid transparent;
		border-right-color: white;
	}
}

.tabItem:hover {
	color: #83daef;
	background-color: rgba(255, 255, 255, 0.06);
}
</style>
