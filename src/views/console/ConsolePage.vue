<template>
	<PageMeta title='控制台' :body-class='$style.container'/>

	<!--
		如果用路由来导航面板，可以让URL更好看，而且能记住历史直接跳转到对应的面板上。
		但是 VueRouter 要求初始化时就配置好子路由，难以分离代码，所以还是用动态组件。
	-->
	<nav :class='$style.tabs'>
		<h1 :class='$style.title'>Kaciras' Blog</h1>

		<ul class='clean-list' role='tablist'>
			<li
				v-for='{ label, view, icon } of views'
				:key='label'
				role='tab'
				tabindex='2'
				:aria-selected='active === view'
				:class='{
						[$style.active]: active === view,
						[$style.tabItem]: true,
					}'
				@click='active = view'
				@keyup.enter='active = view'
			>
				<component :is='icon' :class='$style.icon'/>
				{{ label }}
			</li>
		</ul>

		<RouterLink
			to='/'
			:class='$style.backButton'
		>
			<ArrowLeft :class='$style.icon'/>
			返回首页
		</RouterLink>
	</nav>

	<!--
		将容器元素放在这里，里头的视图使用 Fragment，就像 iframe 一样。
	-->
	<main :class='$style.bodyWrapper'>
		<KeepAlive>
			<component :is='active' ref='panel'/>
		</KeepAlive>
	</main>
</template>

<script setup lang="ts">
import { DefineComponent, nextTick, provide, shallowRef } from "vue";
import PageMeta from "@/components/PageMeta";
import AddLinkIcon from "@material-design-icons/svg/round/add_link.svg?sfc";
import CodeIcon from "@material-design-icons/svg/round/code.svg?sfc";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots-fill.svg?sfc";
import DiagramIcon from "bootstrap-icons/icons/tag-fill.svg?sfc";
import BellIcon from "bootstrap-icons/icons/bell.svg?sfc";
import ArrowLeft from "@material-design-icons/svg/round/arrow_back.svg?sfc";
import ArticleConsole from "./ArticleConsole.vue";
import DraftConsole from "./DraftConsole.vue";
import CategoryConsole from "./CategoryConsole.vue";
import CardsConsole from "./CardsConsole.vue";
import DiscussionConsole from "./DiscussionConsole.vue";
import NotificationConsole from "./NotificationConsole.vue";

const views = [
	{ view: ArticleConsole, label: "文章列表", icon: CodeIcon },
	{ view: DraftConsole, label: "草稿", icon: PencilIcon },
	{ view: DiscussionConsole, label: "评论", icon: ChatIcon },
	{ view: CardsConsole, label: "首页卡片", icon: AddLinkIcon },
	{ view: CategoryConsole, label: "分类", icon: DiagramIcon },
	{ view: NotificationConsole, label: "消息通知", icon: BellIcon },
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
	grid-template-columns: 250px 1fr;
	grid-template-rows: auto 1fr;
}

.title {
	text-align: center;
}

.tabs {
	display: flex;
	flex-direction: column;
	padding-top: 1rem;
	grid-area: menu;

	color: white;
	background: rgb(8,50,91);
	background: linear-gradient(180deg, rgba(8,50,91,1) 0%, rgba(49,109,166,1) 100%);
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

	padding: 14px 0 14px 50px;
	transform: rotateZ(0);

	text-align: start;
	font-size: 1rem;
	border: none;
	background-color: transparent;
	transition: background-color .12s;

	&:hover, &:focus {
		background-color: rgba(255, 255, 255, 0.1);
		outline: none;
	}

	&.active::after {
		content: "";
		.left-triangle(.8rem);
	}
}

.backButton {
	composes: clean-link from global;
	composes: tabItem;

	display: block;
	margin-top: auto;
	border-top: solid 1px rgba(255, 255, 255, 0.4);
}

.icon {
	margin-right: 10px;
	font-size: 1.25em;
	vertical-align: -4px;
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
