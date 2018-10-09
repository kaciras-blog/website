<template>
	<div :class="$style.container">
		<nav class="light nav-item-group" :class="$style.nav">
			<router-link tabindex="1" to="/" class="nav-item">返回首页</router-link>
		</nav>
		<aside :class="$style.tabs">
			<h1>控制台</h1>
			<ul :class="$style.menu" role="tablist">
				<li v-for="link of views"
					:key="link.name"
					role="tab"
					tabindex="2"
					:aria-selected="active === link.name"
					:class="{ [$style.active]: active === link.name, [$style.tabItem]: true}"
					@click="active = link.name"
					@keyup.enter="active = link.name">
					{{link.label}}
				</li>
			</ul>
		</aside>
		<component :is="active" :class="$style.body"/>
	</div>
</template>

<script>
import ArticleConsole from "./ArticleConsole";
import DraftConsole from "./DraftConsole";
import CategoryConsole from "./CategoryConsole";
import SwiperConsole from "./SwiperConsole";

export default {
	name: "ConsolePage",
	components: {
		ArticleConsole,
		DraftConsole,
		CategoryConsole,
		SwiperConsole,
	},
	data: () => ({
		views: [
			{ name: ArticleConsole.name, label: "文章列表" },
			{ name: DraftConsole.name, label: "我的草稿" },
			{ name: SwiperConsole.name, label: "轮播" },
			{ name: CategoryConsole.name, label: "管理分类" },
		],
		active: "ArticleConsole",
	}),
};
</script>

<style module lang="less">
@import "../../css/ToBeImport";

.container {
	height: 100vh;

	display: grid;
	grid-template-areas: "menu nav" "menu body";
	grid-template-columns: 12rem 1fr;
	grid-template-rows: 3rem 1fr;
}

.nav {
	text-align: right;
	padding: 0 1rem;
	min-height: 3rem; // 谷歌的浏览器必须用min-height
	color: @color-nav;
	background-color: @color-nav-background;
	border-bottom: solid 1px #c9c9c9;
	box-shadow: 0 0 @length-border-shadow 1px fade(@color-border, 30%);
	z-index: 1;
}

.tabs {
	padding-top: 1rem;
	grid-area: menu;

	background-color: #1c1d20;
	height: 100%;
	color: #DDD;
	text-align: center;

	& .active::after {
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

.menu {
	padding: 0;
}

.tabItem {
	display: block;
	padding: .6rem;

	list-style: none;
	transform: rotateZ(0);

	font-size: 1rem;
	.click-item;
	text-decoration: none;
	border: none;
	background-color: transparent;
	color: whitesmoke;

	&:hover, &:focus {
		outline: none;
		background-color: rgba(255, 255, 255, 0.15);
	}
}

.body {
	grid-area: body;
	overflow-y: scroll;
	padding: 2rem;
}
</style>
