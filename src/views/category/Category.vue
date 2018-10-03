<template>
	<page-layout
		view-id="category"
		:style="navStyle"
		:banner="true">

		<category-header :value="category"/>
		<category-body/>
	</page-layout>
</template>

<script>
import { mapState } from "vuex";
import CategoryHeader from "./CategoryHeader";
import CategoryBody from "./CategoryBody";
import api from "../../api";

const storeModule = {
	namespaced: true,
	state: () => ({
		item: {},
	}),
	mutations: {
		setItem: (state, item) => state.item = item,
	},
};

export default {
	name: "CategoryPage",
	components: {
		CategoryHeader,
		CategoryBody,
	},
	async asyncData({ store, route, cancelToken }) {
		store.registerModule("category", storeModule);
		store.commit("category/setItem", await api.category.getByName(route.params.name));
	},
	prefetch: true,
	computed: {
		navStyle() {
			return { "--background": `url(${this.category.bestBackground || require("../../assets/index-banner.jpg")})` };
		},
		...mapState({ category: state => state.category.item }),
	},
	destroyed() {
		this.$store.unregisterModule("category");
	},
};
</script>

<style scoped>

</style>
