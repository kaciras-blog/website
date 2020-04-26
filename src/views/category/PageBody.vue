<template>
	<section :class="$style.container">
		<h1 :class="$style.title">文章列表</h1>

		<scroll-paging-view
			v-model="articles"
			:auto-load="true"
			:loader="loadPage"
		>
			<template v-slot="{ items }">
				<ul class="clean-list">
					<article-preview-item
						v-for="item of items"
						:key="item.id"
						:item="item"
						class="segment"
					/>
				</ul>
			</template>
		</scroll-paging-view>
	</section>
</template>

<script>
import api from "../../api";
import ArticlePreviewItem from "../list/ArticlePreviewItem";

export default {
	name: "PageBody",
	components: {
		ArticlePreviewItem,
	},
	data:()=>({
		articles: [],
	}),
	methods: {
		loadPage (start, count) {
			return api.article.getList({
				start,
				count,
				category: this.$route.params["id"],
				recursive: true,
			});
		},
	},
};
</script>

<style module lang="less">
.container {
	margin: 0 auto 60px auto;
	max-width: 70%;
}

.title {
	font-size: 2em;
}
</style>
