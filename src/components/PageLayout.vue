<template>
	<div>
		<top-nav/>
		<div v-if="banner" id="banner"></div>
		<main :id="viewId"><slot/></main>
		<page-footer v-if="footer"/>
	</div>
</template>

<script>
export default {
	// functional: true,
	props: ["footer", "viewId", "banner"],
	name: "PageLayout",
};
</script>
