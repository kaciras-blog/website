<template>
	<base-page-layout :nav-class="$style.topNav">
		<slide-nav :class="$style.header" :tabs="tabs" @change="switchPage"/>
		<component :is="tabPage"/>
	</base-page-layout>
</template>

<script>
import Person from "./Person";
import Technology from "./Technology";
import SlideNav from "./SlideNav";

export default {
	name: "AboutPage",
	components: {
		SlideNav,
		Person,
		Technology,
	},
	data: () => ({
		tabs: [
			{ title: "关于博主", value: "Person" },
			{ title: "关于博客", value: "Technology" },
		],
		tabPage: "Person",
	}),
	methods: {
		switchPage(name) {
			this.tabPage = name;
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.topNav {
	box-shadow: none;
}

.header {
	position: sticky;
	top: 0;
	box-shadow: 0 3px 2px 0 #ececec;
}
</style>
