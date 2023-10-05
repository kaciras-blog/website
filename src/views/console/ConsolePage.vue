<template>
	<PageMeta title='控制台' :body-class='$style.body'/>

	<nav :class='$style.tabs'>
		<h1 :class='$style.title'>Kaciras' Blog</h1>

		<RouterLink
			v-for='{ label, icon, path } of views'
			:key='path'
			:to='path'
			:class='$style.tabItem'
		>
			<component :is='icon' :class='$style.icon'/>
			{{ label }}
		</RouterLink>

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
	<main :class='$style.main'>
		<RouterView v-slot='{ Component }'>
			<KeepAlive>
				<component :is='Component' ref='panel'/>
			</KeepAlive>
		</RouterView>
	</main>
</template>

<script lang="ts">
import AddLinkIcon from "@material-design-icons/svg/round/add_link.svg?sfc";
import CodeIcon from "@material-design-icons/svg/round/code.svg?sfc";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots-fill.svg?sfc";
import DiagramIcon from "bootstrap-icons/icons/tag-fill.svg?sfc";
import BellIcon from "bootstrap-icons/icons/bell.svg?sfc";
import HeartPulse from "bootstrap-icons/icons/heart-pulse-fill.svg?sfc";

import ArticleConsole from "@/views/console/ArticleConsole.vue";
import DraftConsole from "@/views/console/DraftConsole.vue";
import DiscussionConsole from "@/views/console/DiscussionConsole.vue";
import CardsConsole from "@/views/console/CardsConsole.vue";
import CategoryConsole from "@/views/console/CategoryConsole.vue";
import NotificationConsole from "@/views/console/NotificationConsole.vue";
import DiagnosticsConsole from "@/views/console/DiagnosticsConsole.vue";

//@formatter:off
const views = [
	{ path: "article",		component: ArticleConsole,		label: "文章列表",	icon: CodeIcon },
	{ path: "draft",		component: DraftConsole,		label: "草稿",		icon: PencilIcon },
	{ path: "discussion",	component: DiscussionConsole,	label: "评论",		icon: ChatIcon },
	{ path: "card",			component: CardsConsole,		label: "首页卡片",	icon: AddLinkIcon },
	{ path: "category",		component: CategoryConsole,		label: "分类",		icon: DiagramIcon },
	{ path: "notice",		component: NotificationConsole, label: "消息通知",	icon: BellIcon },
	{ path: "diagnostics",	component: DiagnosticsConsole,	label: "诊断",		icon: HeartPulse },
];
//@formatter:on
</script>

<script setup lang="ts">
import { provide, shallowRef } from "vue";
import { useRouter } from "vue-router";
import ArrowLeft from "@material-design-icons/svg/round/arrow_back.svg?sfc";
import PageMeta from "@/components/PageMeta.ts";

const router = useRouter();

const panel = shallowRef();

provide("sendMessage", async (name: string, data: unknown) => {
	await router.push(`/console/${name}`);

	const target = panel.value;
	if ("receiveMessage" in target) {
		target.receiveMessage(data);
	}
});

/*
 * 动态注册子路由，比起写在 router.ts 里内聚性更高，也更简洁。
 * https://router.vuejs.org/guide/advanced/dynamic-routing.html
 *
 * 这里检查了是否能匹配到子组件，没有才添加，避免内存泄漏。
 */
const { matched } = router.resolve("/console/article");
if (matched.length < 2) {
	for (const v of views) {
		router.addRoute("console", v);
	}
	router.replace(router.currentRoute.value.fullPath);
}
</script>

<style module lang="less">
@import "../../css/imports.less";

.body {
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
	background: rgb(8, 50, 91);
	background: linear-gradient(180deg, rgba(8, 50, 91, 1) 0%, rgba(49, 109, 166, 1) 100%);
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
	composes: clean-link from global;

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

	&:global(.router-link-active)::after {
		content: "";
		.left-triangle(.8rem);
	}
}

.backButton {
	composes: tabItem;

	margin-top: auto;
	border-top: solid 1px rgba(255, 255, 255, 0.4);
}

.icon {
	margin-right: 10px;
	font-size: 1.25em;
	vertical-align: -4px;
}

.main {
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
