<template>
	<kx-markdown-editor class="full-screen"/>
</template>

<script>
export default {
	name: "ArticleEditor",
	created() {
		this.$emit("layout-changed", {show: false}, false);
	},
};
</script>
