<template>
	<base-page-layout
		:class="$style.container"
		:nav-class="$style.top_nav"
	>
		<slide-nav :class="$style.header" :tabs="tabs"/>
		<router-view/>
	</base-page-layout>
</template>

<script>
import SlideNav from "./SlideNav";

export default {
	name: "AboutPage",
	components: {
		SlideNav,
	},
	data: () => ({
		tabs: [
			{ title: "关于博主", route: "/about/me" },
			{ title: "技术栈", route: "/about/technology" },
			{ title: "版权声明", route: "/about/copyright" },
		],
	}),
};
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
	border-bottom: solid 1px #eee;
	z-index: 90; // 比TopNav小一点
}
</style>
