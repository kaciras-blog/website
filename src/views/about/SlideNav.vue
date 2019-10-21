<!--
router-link 不能再函数式组件里使用。
TODO: 超出屏幕宽度的元素点击后滚动到可视区
-->
<template>
	<ol :class="$style.tabList" class="clean-list" role="tablist">
		<router-link
			v-for="tab of tabs"
			:key="tab.title"
			tag="li"
			:to="tab.route"
			replace
			role="tab"
			:active-class="$style.active"
			:class="$style.tabItem"
			v-ripple
		>
			<a :class="$style.text" :href="tab.route">{{tab.title}}</a>
		</router-link>
	</ol>
</template>

<script>
export default {
	name: "SlideNav",
	props: {
		/** Array<{ title: string, route: string }> */
		tabs: { type: Array, required: true },
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.tabList {
	display: flex;
	margin: 0;
	background-color: white;
	overflow-x: auto;
	justify-content: center;
}

// 纯 CSS 实现下边框两个方向平移
// 关键在于使用后面的元素选择符，改变激活元素之后所有元素的边框起始位置
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
		background-color: #00b4eb;
		transition: .15s all linear;
	}
}

.active {
	color: #00b4eb;

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
	padding: 15px;

	&:hover, &:active, &:visited, &:focus {
		color: inherit;
		text-decoration: none;
	}
}
</style>
