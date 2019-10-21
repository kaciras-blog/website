<template>
	<base-page-layout :nav-class="$style.topNav">
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
			{ title: "关于博主", route: "/about/blogger" },
			{ title: "技术栈", route: "/about/technology" },
		],
	}),
};
</script>

<style module lang="less">
@import "../../css/Imports";

.topNav {
	position: static;
	box-shadow: none;
}

.header {
	position: sticky;
	top: 0;
	box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.05);
	z-index: 90; // 比TopNav小一点
}
</style>
