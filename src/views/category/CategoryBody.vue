<template>
	<section :class="$style.container">
		<h1 :class="$style.title">文章列表</h1>

		<scroll-pageing-view :loader="load">
			<template v-slot="{ items }">
				<ul class="list">
					<article-preview-item
						v-for="item of items"
						:key="item.id"
						:item="item"
						class="segment"/>
				</ul>
			</template>
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
	margin: 0 auto;
	max-width: 75%;
	/*&::after {*/
	/*content: "";*/
	/*position: absolute;*/

	/*top: 0;*/
	/*left: calc(15% + 6rem);*/
	/*width: 6px;*/
	/*height: 100%;*/
	/*background-color: #007aff;*/
	/*}*/
}

.title {
	font-size: 2em;
}
</style>
