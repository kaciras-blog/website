<template>
	<banner-page-layout :banner="category.banner">
		<page-header :value="category"/>
		<family-section
			:parent="category.parent"
			:children="category.children"
		/>
		<!-- 设置key在路由改变时清除加载的文章 -->
		<page-body :key="$route.params.id"/>
	</banner-page-layout>
</template>

<script>
import { mapState } from "vuex";
import PageHeader from "./PageHeader";
import PageBody from "./PageBody";
import api from "../../api";
import TitleMixin from "../../title-mixin";
import FamilySection from "./FamilySection";

export default {
	name: "CategoryPage",
	mixins: [TitleMixin],
	components: {
		PageHeader,
		PageBody,
		FamilySection,
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
