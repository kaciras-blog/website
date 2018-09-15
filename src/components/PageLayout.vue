<template>
	<div id="container">
		<top-nav :class="navClass"
				 :style="navStyle"
				 :banner="banner"/>
		<main :id="viewId"><slot/></main>
		<page-footer v-if="footer"/>
	</div>
</template>

<script>
export default {
	props: ["banner", "footer", "viewId", "navStyle", "navClass"],
	name: "PageLayout",
};
</script>
