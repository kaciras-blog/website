<template>
	<aside class="flex vertical panel">
		<div>
			<h3 class="padding">置顶</h3>
			<p style="text-align: center">暂无</p>
		</div>
		<div>
			<h3 class="padding">浏览排行</h3>
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
