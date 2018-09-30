<template>
	<page-layout
		view-id="category"
		:style="{ '--background': category.background }"
		:banner="true">

		<category-header :value="category"/>
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
	computed: {
		category() { return null; },
	},
};
</script>

<style scoped>

</style>
