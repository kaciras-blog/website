<template>
	<div :class="$style.container">

		<header :class="$style.header">
			<button
				title="返回"
				:class="$style.back_button"
				@click="$dialog.close"
			>
				<i class="fas fa-arrow-left"/>
			</button>

			<span :class="$style.title">{{ title }}</span>
		</header>

		<slot></slot>
	</div>
</template>

<script>
import { PreventScrollMixin } from "@kaciras-blog/uikit";

export default {
	name: "KxFrame",
	mixins: [PreventScrollMixin],
	props: {
		title: String,
	},
};
</script>

<style module lang="less">
@headerHeight: 48px;

.container {
	composes: full-vertex from global;

	display: flex;
	flex-direction: column;

	position: fixed;
	z-index: 900;

	background-color: white;
}

.header {
	position: relative;
	height: @headerHeight;

	text-align: center;
	border-bottom: 1px solid #eee;
}

.back_button {
	position: absolute;
	left: 0;
	top: 2px; // 不知道咋的箭头位置就是有点高了
	bottom: 0;

	width: @headerHeight;
	padding: 0 !important; // 屏蔽按钮点击凹陷效果

	font-size: 20px;
	background: none;

	&:active {
		background: whitesmoke;
	}
}

.title {
	font-size: 16px;
	line-height: @headerHeight;
}
</style>
