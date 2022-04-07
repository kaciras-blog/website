<template>
	<PageMeta title="控制台" :body-class="$style.container"/>

	<nav class="light" :class="$style.nav">
		<router-link
			to="/"
			class="nav-item"
			tabindex="1"
		>
			返回首页
		</router-link>
	</nav>

	<!--
		如果用路由来导航面板，可以让URL更好看，而且能记住历史直接跳转到对应的面板上。
		但是 VueRouter 要求初始化时就配置好子路由，难以分离代码，所以还是用动态组件。
	-->
	<aside :class="$style.tabs">
		<h1>控制台</h1>
		<ul class="clean-list" role="tablist">
			<li
				v-for="{ label, view } of views"
				:key="label"
				role="tab"
				tabindex="2"
				:aria-selected="active === view"
				:class="{
						[$style.active]: active === view,
						[$style.tabItem]: true,
					}"
				@click="active = view"
				@keyup.enter="active = view"
			>
				{{ label }}
			</li>
		</ul>
	</aside>

	<!--
		将容器元素放在这里，里头的视图使用 Fragment，就像 iframe 一样。
	-->
	<main :class="$style.bodyWrapper">
		<keep-alive>
			<component :is="active" ref="panel"/>
		</keep-alive>
	</main>
</template>

<script setup lang="ts">
import { DefineComponent, nextTick, provide, shallowRef } from "vue";
import ArticleConsole from "./ArticleConsole.vue";
import DraftConsole from "./DraftConsole.vue";
import CategoryConsole from "./CategoryConsole.vue";
import CardsConsole from "./CardsConsole.vue";
import DiscussionConsole from "./DiscussionConsole.vue";
import NotificationConsole from "./NotificationConsole.vue";
import PageMeta from "@/components/PageMeta";

const views = [
	{ view: ArticleConsole, label: "文章列表" },
	{ view: DraftConsole, label: "草稿" },
	{ view: DiscussionConsole, label: "评论" },
	{ view: CardsConsole, label: "首页卡片" },
	{ view: CategoryConsole, label: "分类" },
	{ view: NotificationConsole, label: "消息通知" },
];

const active = shallowRef(ArticleConsole);
const panel = shallowRef();

provide("sendMessage", async (component: DefineComponent, data: unknown) => {
	active.value = component;
	await nextTick();

	const target = panel.value;
	if ("receiveMessage" in target) {
		target.receiveMessage(data);
	}
});
</script>

<style module lang="less">
@import "../../css/imports";

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

	border-bottom: solid 1px @color-border;
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
	composes: click-item from global;

	padding: 10px 0;
	transform: rotateZ(0);

	font-size: 1rem;
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

.bodyWrapper {
	grid-area: body;
	padding: 30px;
	overflow-y: scroll;
}
</style>

<style lang="less">
.console-toolbar {
	margin-bottom: 30px;
}
</style>
