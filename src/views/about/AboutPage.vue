<template>
	<base-page-layout
		:class="$style.container"
		:nav-class="$style.top_nav"
	>
		<slide-nav
			:class="$style.header"
			:tabs="tabs"
		/>
		<router-view/>
	</base-page-layout>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import BasePageLayout from "@/components/BasePageLayout.vue";
import SlideNav from "./SlideNav.vue";

const tabs = [
	{ title: "博主", route: "/about/me" },
	{ title: "友链", route: "/about/friends" },
	{ title: "技术栈", route: "/about/technology" },
	{ title: "版权声明", route: "/about/copyright" },
];
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: whitesmoke;
}

.top_nav {
	position: static;
	box-shadow: none;
	background: white;
}

.header {
	position: sticky;
	top: 0;
	z-index: 90; // 比 TopNav 小一点

	// 用伪元素模拟边框，使按钮下面的蓝条能够覆盖它，
	// 普通的 border 在元素内容之外无法覆盖。
	&::before {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background-color: #eee;
	}
}
</style>
