<template>
	<page-layout view-id="category">
		<category-header/>
		<category-body/>
	</page-layout>
</template>

<script>
import CategoryHeader from "./CategoryHeader";
import CategoryBody from "./CategoryBody";



export default {
	name: "CategoryPage",
	components: { CategoryBody, CategoryHeader },
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	async asyncData({ store, route }) {

	},
};
</script>

<style scoped>

</style>
