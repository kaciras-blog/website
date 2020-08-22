<!--
【props 说明】
disabled - 是否禁止点击跳转，以及 hover、focus 动效，在拖动排序时用
friend	 - 友链对象

【懒加载的问题】
拖动排序中会不断删除和添加元素，这会导致懒加载必须处理这些问题。
目前友链也不多，每张图都很小，还是不做这功能了吧。
-->
<template functional>
	<component
		:is="props.disabled ? 'div' : 'a'"
		:href="props.friend.url"
		target="_blank"
		:class="[$style.container, data.class]"
		:style="data.style"
		@mousedown="listeners.dragstart"
	>
		<img
			:src="props.friend.background"
			alt="background"
			:class="$style.background"
		>
		<img
			:src="props.friend.favicon"
			alt="favicon"
			:class="$style.favicon"
		>
		<span :class="$style.name">{{props.friend.name}}</span>
	</component>
</template>

<script>
export default {
	name: "FriendCard",
};
</script>

<style module lang="less">
@import "../../css/imports";

/*
 * 友链卡片的样式模仿了 Aurora - https://github.com/chanshiyucx/aurora
 *
 * 原版 hover 的动画是整个上移，我这改成了上下两个方向开启。
 */
@width: 260px;
@height: @width * 9 / 16;

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

a.container {
	cursor: revert;

	@media screen and (min-width: @length-screen-mobile) {
		@ty: (@height + @favicon-size) / -2;

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
	left: (@width - @favicon-size) / 2;
	top: (@height - @favicon-size) / 2;
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
	padding-top: @height / 2 - 30px;
	padding-bottom: 8px;
	text-align: center;

	color: black;
	background: rgba(255, 255, 255, .9);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);

	transition: @transition;
}
</style>
