<template>
	<page-layout
		view-id="category"
		:nav-class="navClass"
		:nav-style="navStyle"
		:banner="true"
		:footer="true">

		<category-header :value="category"/>
		<family-section
			:parent="category.parent"
			:children="category.children"/>

		<!-- 设置key在路由改变时清除加载的文章 -->
		<category-body :key="$route.params.id"/>
	</page-layout>
</template>

<script>
import { mapState } from "vuex";
import CategoryHeader from "./CategoryHeader";
import CategoryBody from "./CategoryBody";
import api from "../../api";
import TitleMixin from "../../title-mixin";
import FamilySection from "./FamilySection";

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
		FamilySection,
		CategoryHeader,
		CategoryBody,
	},
	asyncData ({ store, route, cancelToken, protorype }) {
		if (!store.state.category) {
			store.registerModule("category", storeModule);
		}
		return api.category
			.withCancelToken(cancelToken)
			.withPrototype(protorype)
			.get(route.params.id)
			.then(items => store.commit("category/setItem", items));
	},
	prefetch: true,
	title () {
		return this.category.name;
	},
	computed: {
		navStyle () {
			const banner = this.category.banner;
			if (!banner) {
				return null;
			}
			return { "--background": `url(${banner.image})` };
		},
		navClass () {
			const banner = this.category.banner;
			if (!banner) {
				return "default-banner";
			}
			if (banner.theme === 1) {
				return "light";
			} else if (banner.theme === 2) {
				return "dark";
			}
			return null;
		},
		...mapState({ category: state => state.category.item }),
	},
	destroyed () {
		this.$store.unregisterModule("category");
	},
};
</script>

<style lang="less">
#category {

}
</style>
