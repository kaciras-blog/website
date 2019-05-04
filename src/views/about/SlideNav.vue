<!--
TODO: 超出屏幕宽度的元素点击后滚动到可视区
-->
<template>
	<ol :class="$style.tabList" class="list">

		<li v-for="(tab, i) of tabs"
			:key="tab.title"
			:class="[$style.tabItem, { [$style.active]: i === active }]"
			@click="onClick(i)">
			{{tab.title}}
		</li>
	</ol>
</template>

<script>
export default {
	name: "SlideNav",
	props: {
		tabs: {}, // { title, value }
	},
	data: () => ({
		active: 0,
	}),
	methods: {
		onClick(index) {
			this.active = index;
			this.$emit("change", this.tabs[index].value);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.tabList {
	display: flex;
	background-color: white;
	overflow-x: auto;

	@media screen and (min-width: @length-screen-mobile) {
		justify-content: center;
	}
}

// 纯 CSS 实现下边框两个方向平移
// 关键在于使用后面的元素选择符，改变激活元素之后所有元素的边框起始位置
.tabItem {
	position: relative;
	padding: 15px;
	font-size: 16px;

	@media screen and (min-width: @length-screen-mobile) {
		font-size: 20px;
	}

	word-break: keep-all;
	cursor: pointer;
	user-select: none;

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
</style>
