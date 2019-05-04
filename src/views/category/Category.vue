<template>
	<banner-page-layout :banner="category.banner">
		<category-header :value="category"/>
		<family-section
			:parent="category.parent"
			:children="category.children"/>
		<!-- 设置key在路由改变时清除加载的文章 -->
		<category-body :key="$route.params.id"/>
	</banner-page-layout>
</template>

<script>
import { mapState } from "vuex";
import CategoryHeader from "./CategoryHeader";
import CategoryBody from "./CategoryBody";
import api from "../../api";
import TitleMixin from "../../title-mixin";
import FamilySection from "./FamilySection";

export default {
	name: "CategoryPage",
	mixins: [TitleMixin],
	components: {
		FamilySection,
		CategoryHeader,
		CategoryBody,
	},
	asyncData (session) {
		return api
			.withCancelToken(session.cancelToken)
			.withPrototype(session.request)
			.category
			.get(session.route.params.id, true)
			.then(session.dataSetter("item"));
	},
	title () {
		return this.category.name;
	},
	computed: mapState({
		category: state => state.prefetch.item,
	}),
};
</script>
