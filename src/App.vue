<template>
	<div id="app">
		<top-nav></top-nav>
		<router-view></router-view>
		<page-footer></page-footer>
	</div>
</template>

<script>
	import TopNav from "./components/TopNav";
	import PageFooter from "./components/PageFooter";
	import Vue from "vue";

	Vue.component(TopNav.name, TopNav);
	Vue.component(PageFooter.name, PageFooter);
</script>
