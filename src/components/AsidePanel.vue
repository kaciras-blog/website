<template>
	<aside class="panel">
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
import api from "../apis.js";

export default {
	name: "aside-panel",
	data() {
		return {
			hotArticles: [],
		};
	},
	created () {
		api.recommend.getHotArticles().then(hots => this.hotArticles = hots);
	},
};
</script>

<style scoped lang="less">
.padding{
	padding-top: .2em;
	padding-bottom: .2em;
}
</style>
