<template>
	<page-layout view-id="welcome-page">
		<blog-section/>
		<i-m-section/>
	</page-layout>
</template>

<script>
import BlogSection from "./BlogSection";
import IMSection from "./IMSection";

export default {
	name: "Welcome",
	components: { IMSection, BlogSection },
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

#welcome-page {
	margin-top: 4rem;
}
</style>
