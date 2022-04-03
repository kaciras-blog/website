<!--
【props 说明】
active   - 是否加载图片等消耗性能的资源
disabled - 是否禁止点击跳转，以及 hover、focus 动效，在拖动排序时用
friend	 - 友链对象

【禁用的实现】
改变 <component> 渲染的元素会导致整个子树更新，应该避免，改为其它禁用实现。
-->
<template>
	<a
		:disabled="disabled"
		:href="friend.url"
		target="_blank"
		rel="noopener"
		:class="$style.container"
	>
		<img
			:src="active ? friend.background : null"
			alt="background"
			:class="$style.background"
		>
		<img
			:src="active ? friend.favicon ?? DEFAULT_AVATAR : null"
			alt="favicon"
			:class="$style.favicon"
		>
		<span :class="$style.name">{{ friend.name }}</span>
	</a>
</template>

<script setup lang="ts">
import { Friend } from "@/api";
import { DEFAULT_AVATAR } from "@/common";

interface FriendCardProps {
	friend: Friend;
	disabled: boolean;
	active: boolean;
}

defineProps<FriendCardProps>();
</script>

<style module lang="less">
@import "../../css/imports";

/*
 * 友链的样式模仿了 https://github.com/chanshiyucx/aurora
 *
 * 原版 hover 的动画是整个上移，我这改成了上下两个方向开启。
 */
@width: 260px;
@height: (@width * 9 / 16);

@favicon-size: 70px;
@transition: transform .5s;

.container {
	display: block;
	position: relative;
	width: @width;
	height: @height;

	// 默认是拖动状态
	cursor: grab;

	border-radius: 4px;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 50%;

		z-index: 1;
		background: rgba(255, 255, 255, .4);
		transition: @transition;
	}
}

.container:not([disabled]) {
	cursor: revert;

	@media screen and (min-width: @length-screen-mobile) {
		@ty: ((@height + @favicon-size) / -2);

		&:hover, &:focus {
			&::before { transform: translateY(@ty); }

			& > .favicon { transform: translateY(@ty); }

			& > .name { transform: translateY(100%); }
		}
	}
}

.background {
	composes: full-vertex from global;
	width: 100%;
	height: 100%;
}

.favicon {
	position: absolute;
	left: ((@width - @favicon-size) / 2);
	top: ((@height - @favicon-size) / 2);
	.circle(@favicon-size);

	z-index: 3;
	box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	transition: @transition;
}

.name {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50%;

	font-size: 16px;
	padding-top: (@height / 2 - 30px);
	padding-bottom: 8px;
	text-align: center;

	color: black;
	background: rgba(255, 255, 255, .9);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);

	transition: @transition;
}
</style>
