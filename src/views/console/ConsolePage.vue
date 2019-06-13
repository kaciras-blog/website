<template>
	<div :class="$style.container">
		<nav class="light nav-item-group" :class="$style.nav">
			<router-link tabindex="1" to="/" class="nav-item">返回首页</router-link>
		</nav>
		<aside :class="$style.tabs">
			<h1>控制台</h1>
			<ul class="clean-list" role="tablist">
				<li v-for="link of views"
					:key="link.label"
					role="tab"
					tabindex="2"
					:aria-selected="active === link.name"
					:class="{ [$style.active]: active === link.view, [$style.tabItem]: true}"
					@click="active = link.view"
					@keyup.enter="active = link.view">
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
import SlideConsole from "./SlideConsole";
import DiscussionConsole from "./DiscussionConsole";

export default {
	name: "ConsolePage",
	components: {
		ArticleConsole,
		DraftConsole,
		CategoryConsole,
		SlideConsole,
	},
	data: () => ({
		views: [
			{ view: ArticleConsole, label: "文章列表" },
			{ view: DraftConsole, label: "我的草稿" },
			{ view: DiscussionConsole, label: "评论系统" },
			{ view: SlideConsole, label: "卡片" },
			{ view: CategoryConsole, label: "管理分类" },
		],
		active: ArticleConsole,
	}),
};
</script>

<style module lang="less">
@import "../../css/Imports";

.container {
	height: 100vh;

	display: grid;
	grid-template-areas: "menu nav" "menu body";
	grid-template-columns: 12rem 1fr;
	grid-template-rows: auto 1fr;
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

	background-color: #222429;
	height: 100%;
	color: #DDD;
	text-align: center;
}

.left-triangle(@size) {
	position: absolute;
	top: 50%;
	right: 0;
	margin-top: -@size;

	width: 0;
	height: 0;
	border: @size solid transparent;
	border-right-color: white;
}

.tabItem {
	padding: .8rem 0;
	transform: rotateZ(0);

	font-size: 1rem;
	.click-item;
	text-decoration: none;
	border: none;
	background-color: transparent;
	color: whitesmoke;

	&:hover, &:focus {
		outline: none;
		background-color: rgba(255, 255, 255, 0.1);
	}

	&.active::after {
		content: "";
		.left-triangle(.8rem);
	}
}

.body {
	grid-area: body;
	overflow-y: scroll;
	padding: 2rem;
}
</style>
