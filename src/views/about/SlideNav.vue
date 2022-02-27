<!--
	router-link 不能在函数式组件里使用。
	Vue-Router 4 的写法变复杂了啊。
-->
<template>
	<ol :class="$style.tabList" class="clean-list" role="tablist">
		<router-link
			v-for="tab of tabs"
			:key="tab.title"
			replace
			custom
			:to="tab.route"
			v-slot="{ isActive, navigate }"
		>
			<li
				role="tab"
				:class="{
					[$style.tabItem]:true,
					[$style.active]: isActive
				}"
				v-ripple
			>
				<a
					:href="tab.route"
					:class="$style.text"
					@click="navigate"
					@keypress.enter="navigate"
				>
					{{ tab.title }}
				</a>
			</li>
		</router-link>
	</ol>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

interface SlideNavProps {
	tabs: Array<{ title: string; route: string }>;
}

defineProps<SlideNavProps>();
</script>

<style module lang="less">
@import "../../css/imports";

.tabList {
	display: flex;
	margin: 0;
	background-color: white;
	overflow-x: auto;
	justify-content: center;
}

/*
 * 纯 CSS 实现下划线两个方向平移。
 * 关键在于使用后面的元素选择符，改变激活元素之后所有元素的边框起始位置。
 *
 * 【CSS导航栏下划线跟随效果】
 * https://www.cnblogs.com/coco1s/p/8657192.html
 */
.tabItem {
	position: relative;
	font-size: 16px;
	word-break: keep-all;
	cursor: pointer;
	user-select: none;

	@media screen and (min-width: @length-screen-mobile) {
		font-size: 20px;
	}

	&::before {
		content: "";
		position: absolute;
		bottom: 0;
		left: 100%;
		right: 0;
		height: 3px;
		background-color: @color-primary;
		transition: .15s all linear;
	}
}

.active {
	color: @color-primary;

	&::before {
		left: 0;
		right: 0;
	}

	& ~ .tabItem::before {
		left: 0;
		right: 100%;
	}
}

/* TODO: 去除高亮样式的链接元素很多地方都要用 */
.text {
	display: block;
	padding: 10px 16px;

	&:hover, &:active, &:visited, &:focus {
		color: inherit;
		text-decoration: none;
	}
}
</style>
