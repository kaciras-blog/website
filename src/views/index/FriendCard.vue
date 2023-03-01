<!--
【禁用的实现】
原本通过把根元素改成 span 来禁用跳转，但改变 <component> 的元素会导致整个子树重新渲染。
所以换用 disabled 属性。

【背景放哪】
背景图不认为是跟内容强相关的，所以应当使用 background 样式而不是 img 元素。
-->
<template>
	<a
		:disabled='disabled || null'
		:href='friend.url'
		target='_blank'
		rel='noopener'
		:class='$style.container'
		:style='active && {
			background: `url("${friend.background}")`,
		}'
	>
		<img
			:src='active ? friend.favicon ?? DEFAULT_AVATAR : null'
			alt='favicon'
			:class='$style.favicon'
		>
		<span :class='$style.name'>{{ friend.name }}</span>
	</a>
</template>

<script setup lang="ts">
import { DEFAULT_AVATAR } from "@/common";
import { Friend } from "@/api";

interface FriendCardProps {

	/**
	 * 是否加载图片等消耗性能的资源，用于懒加载。
	 */
	active: boolean;

	/**
	 * 友链对象。
	 */
	friend: Friend;

	/**
	 * 是否禁止点击、hover 和 focus 动效，在拖动时用。
	 */
	disabled: boolean;
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
@width: 256px;
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

	border-radius: 6px;
	overflow: hidden;

	// 卡片背景可能是白色，故用阴影跟外部区分一下。
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);

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

		&:is(:hover, :focus) {
			&::before { transform: translateY(@ty); }

			& > .favicon { transform: translateY(@ty); }

			& > .name { transform: translateY(100%); }
		}
	}
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
	padding-top: (@height / 2 - 32px);
	padding-bottom: 8px;
	text-align: center;

	color: black;
	background: rgba(255, 255, 255, .9);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);

	transition: @transition;
}
</style>
