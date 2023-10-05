<!--
【多个 nav 元素】
GitHub 在 Explore 页面同样用了多个 nav 来包裹不同区域的链接，
并且都处于顶层上下文，所以这么做应该是可行的。
-->
<template>
	<nav :class='$style.tabList'>
		<RouterLink
			v-for='tab of tabs'
			:key='tab.title'
			replace
			custom
			:to='tab.route'
			v-slot='{ isActive, navigate }'
		>
			<a
				:href='tab.route'
				:class='[
					$style.tabItem,
					isActive && $style.active
				]'
				@click='navigate'
				@keydown.enter='navigate'
				v-ripple
			>
				{{ tab.title }}
			</a>
		</RouterLink>
	</nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { vRipple } from "@kaciras-blog/uikit";

interface SlideNavProps {
	tabs: Array<{ title: string; route: string }>;
}

defineProps<SlideNavProps>();
</script>

<style module lang="less">
@import "../../css/imports.less";

.tabList {
	display: flex;
	justify-content: center;
	overflow-x: auto;

	background-color: white;
}

/*
 * 纯 CSS 实现下划线两个方向平移。
 * 关键在于使用后面的元素选择符，改变激活元素之后所有元素的边框起始位置。
 *
 * 【CSS导航栏下划线跟随效果】
 * https://www.cnblogs.com/coco1s/p/8657192.html
 */
.tabItem {
	display: block;
	padding: 10px 16px;

	position: relative;
	font-size: 16px;
	word-break: keep-all;

	/* TODO: 去除高亮样式的链接元素很多地方都要用 */
	color: var(--color);

	&:is(:hover, :active, :visited, :focus) {
		color: var(--color);
		text-decoration: none;
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

	@media screen and (min-width: @length-screen-mobile) {
		font-size: 20px;
	}
}

.active {
	--color: @color-primary;

	&::before {
		left: 0;
		right: 0;
	}

	& ~ .tabItem::before {
		left: 0;
		right: 100%;
	}
}
</style>
