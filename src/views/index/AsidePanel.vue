<template>
	<aside class="panel">
		<div>
			<h3 class="padding">置顶</h3>
			<p class="no-content">暂无</p>
		</div>
		<div>
			<h3 class="padding">浏览排行</h3>
			<ol v-if="hots"
				class="rank">

				<!-- 这里要保持<a>元素的链接便于爬虫跟进，不能直接把<router-link>搞成<li> -->
				<li v-for="article in hots"
					:key="article.id">

					<router-link
						:to="article | articleLink"
						class="item">
						{{article.title}}
					</router-link>
				</li>
			</ol>
			<p class="no-content" v-else>加载失败</p>
		</div>
		<div>
			<h3 class="padding">其它</h3>
			<p class="no-content">暂无</p>
		</div>
	</aside>
</template>

<script>
import api from "../../api.js";

export default {
	name: "AsidePanel",
	data() {
		const store = this.$store.state.index;
		if (store) {
			return { hots: store.hots };
		}
		return { hots: null };
	},
	beforeMount() {
		if(!this.hots)
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
