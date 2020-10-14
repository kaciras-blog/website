<template>
	<div :class="$style.container">
		<nav class="light nav-item-group" :class="$style.nav">
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
			但是 VueRouter 要求初始化时就配置好子路由，这样就难以分离代码，所以这里还是用动态组件。
		-->
		<aside :class="$style.tabs">
			<h1>控制台</h1>
			<ul class="clean-list" role="tablist">
				<li
					v-for="link of views"
					:key="link.label"
					role="tab"
					tabindex="2"
					:aria-selected="active === link.view"
					:class="{
						[$style.active]: active === link.view,
						[$style.tabItem]: true,
					}"
					@click="active = link.view"
					@keyup.enter="active = link.view"
				>
					{{link.label}}
				</li>
			</ul>
		</aside>

		<main :class="$style.body_wrapper">
			<!-- 多面板联动必须要 keep-alive 一下 -->
			<keep-alive>
				<component :is="active" ref="panel" :class="$style.body"/>
			</keep-alive>
		</main>
	</div>
</template>

<script>
import ArticleConsole from "./ArticleConsole";
import DraftConsole from "./DraftConsole";
import CategoryConsole from "./CategoryConsole";
import CardsConsole from "./CardsConsole";
import DiscussionConsole from "./DiscussionConsole";
import NotificationConsole from "./NotificationConsole";

export default {
	data: () => ({
		views: [
			{ view: ArticleConsole, label: "文章列表" },
			{ view: DraftConsole, label: "草稿" },
			{ view: DiscussionConsole, label: "评论" },
			{ view: CardsConsole, label: "首页卡片" },
			{ view: CategoryConsole, label: "分类" },
			{ view: NotificationConsole, label: "消息通知" },
		],
		active: ArticleConsole,
	}),
	provide() {
		return { sendMessage: this.sendMessage };
	},
	methods: {
		async sendMessage(component, data) {
			this.active = component;
			await this.$nextTick();

			const target = this.$refs.panel;
			if ("receiveMessage" in target) {
				target.receiveMessage(data);
			}
		},
	},
};
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
	margin-bottom: 30px;
}
</style>
