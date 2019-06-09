<template>
	<section :class="$style.container">
		<h1 :class="$style.title">文章列表</h1>

		<scroll-paging-view
			:auto-load="true"
			:loader="load">

			<template v-slot="{ items }">
				<ul class="list">
					<article-preview-item
						v-for="item of items"
						:key="item.id"
						:item="item"
						class="segment"/>
				</ul>
			</template>
		</scroll-paging-view>
	</section>
</template>

<script>
import api from "../../api";
import ArticlePreviewItem from "../list/ArticlePreviewItem";

export default {
	name: "CategoryBody",
	components: { ArticlePreviewItem },
	methods: {
		load (items, pageSize) {
			return api.article.getList({
				category: this.$route.params["id"],
				start: items.length,
				count: pageSize,
				recursive: true,
			}).then(list => items.push.apply(items, list));
		},
	},
};
</script>

<style module lang="less">
.container {
	margin: 0 auto 60px auto;
	max-width: 75%;
}

.title {
	font-size: 2em;
}
</style>
