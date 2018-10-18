<template>
	<section :class="$style.container">
		<scroll-pageing-view :loader="load">

			<ul slot-scope="{ items }"
				class="list">

				<article-preview-item
					v-for="item of items"
					:key="item.id"
					:item="item"
					class="segment"/>
			</ul>
		</scroll-pageing-view>
	</section>
</template>

<script>
import api from "../../api";
import ArticlePreviewItem from "../index/ArticlePreviewItem";


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

}
</style>
