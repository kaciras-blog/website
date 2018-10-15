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
import axios from "axios";
import TitleMixin from "../../title-mixin";

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
	mixins: [TitleMixin],
	components: {
		CategoryHeader, CategoryBody,
	},
	asyncData(store, route, cancelToken) {
		store.registerModule("category", storeModule);
		const axiosCancelToken = axios.CancelToken.source();
		cancelToken.onCancel(axiosCancelToken.cancel);

		api.category
			.withCancelToken(axiosCancelToken.token)
			.getByName(route.params.name)
			.then(items => store.commit("category/setItem", items));
	},
	prefetch: true,
	title() {
		return this.category.name;
	},
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

<style lang="less">

</style>
