<template>
	<aside class="panel">
		<div>
			<h3 class="padding">置顶</h3>
			<p class="no-content">暂无</p>
		</div>
		<div>
			<h3 class="padding">浏览排行</h3>
			<ol class="rank" v-if="hots">
				<li v-for="article in hots" :key="article.id">
					<router-link class="item" :to="'/article/' + article.id">{{article.title}}</router-link>
				</li>
			</ol>
			<p class="no-content" v-else>暂无</p>
		</div>
	</aside>
</template>

<script>
import api from "../apis.js";

export default {
	name: "AsidePanel",
	data() {
		return {
			hots: null,
		};
	},
	created() {
		api.recommend.getHotArticles().then(hots => this.hots = hots);
	},
};
</script>

<style lang="less">
.padding {
	padding-top: .2em;
	padding-bottom: .2em;
}
.no-content {
	text-align: center;
}
</style>
