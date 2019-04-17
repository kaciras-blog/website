<template functional>
	<li :class="$style.listItem">
		<router-link :to="props.link" :class="$style.card">

			<img :src="props.picture"
				 alt="封面"
				 :class="$style.image">

			<div :class="$style.content">
				<h2 :class="$style.title">{{props.name}}</h2>
				{{props.description}}
			</div>
		</router-link>
	</li>
</template>

<style module lang="less">
@import "../../css/Imports";

.listItem {
	list-style: none;

	@media screen and (min-width: @length-screen-mobile) {
		width: 320px;
		height: 480px;
	}
}

.card {
	display: block;
	width: 100%;
	height: 100%;
	font-size: 16px;

	box-shadow:
		0 2px 3px rgba(10, 10, 10, .1),
		0 0 0 1px rgba(10, 10, 10, .1);
	border-radius: 8px;
	overflow: hidden;

	/* TODO: 取消链接样式应该挺常用的，能否提取 */
	&:hover, &:focus, &:visited {
		color: @color-text;
		text-decoration: none;
	}
}

.image {
	width: 100%;
	height: 250px;

	@media screen and (max-width: @length-screen-mobile) {
		height: 65vw;
	}
}

.title {
	line-height: 1.15;
}

.content {
	padding: 20px;
	line-height: 1.5;
}
</style>
