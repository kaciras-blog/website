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
		<main :class="$style.body_wrapper">
			<keep-alive><component :is="active" :class="$style.body"/></keep-alive>
		</main>
	</div>
</template>

<script>
import ArticleConsole from "./ArticleConsole";
import DraftConsole from "./DraftConsole";
import CategoryConsole from "./CategoryConsole";
import CardsConsole from "./CardsConsole";
import DiscussionConsole from "./DiscussionConsole";

export default {
	name: "ConsolePage",
	data: () => ({
		views: [
			{ view: ArticleConsole, label: "文章列表" },
			{ view: DraftConsole, label: "我的草稿" },
			{ view: DiscussionConsole, label: "评论系统" },
			{ view: CardsConsole, label: "卡片" },
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
	grid-template-columns: 210px 1fr;
	grid-template-rows: auto 1fr;
}

.nav {
	--nav-height: 3rem;

	text-align: right;
	padding: 0 1rem;
	min-height: 3rem; // 谷歌的浏览器必须用min-height
	z-index: 1;

	border-bottom: solid 1px #c9c9c9;
	box-shadow: 0 0 @length-border-shadow 1px fade(@color-border, 30%);
}

.tabs {
	padding-top: 1rem;
	grid-area: menu;

	background-color: #222429;
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
	border: none;
	background-color: transparent;
	color: whitesmoke;

	&:hover, &:focus {
		background-color: rgba(255, 255, 255, 0.1);
		outline: none;
	}

	&.active::after {
		content: "";
		.left-triangle(.8rem);
	}
}

// 网格布局会使padding失效？只能外套一层然后内层加margin
.body_wrapper {
	grid-area: body;
	overflow-y: scroll;
}

.body {
	margin: 30px;
}
</style>

<style lang="less">
.console-toolbar {
	margin-bottom: 1rem;
}
</style>
