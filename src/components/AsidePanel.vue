<template>
	<aside class="flex vertical panel aside-recommand">
		<div>
			<h2 class="compact header">置顶</h2>
			<p style="text-align: center">暂无</p>
		</div>
		<div>
			<h2 class="compact header">浏览排行</h2>
			<ol class="rank">
				<li v-for="article in hotArticles" :key="article.id">
					<a target='_Blank' :href="'/article/' + article.id">{{article.title}}</a>
				</li>
			</ol>
		</div>
	</aside>
</template>

<script>
import apis from "../apis.js";

export default {
	name: "aside-panel",
	data() {
		return {
			hotArticles: [],
		};
	},
	created () {
		apis.article.getRecommendations().then(hots => this.hotArticles = hots);
	},
};
</script>
