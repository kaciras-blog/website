<template>
	<aside>
		<h3 class="padding" :class="$style.padding">置顶</h3>
		<p :class="$style.noContent">暂无</p>

		<h3 class="padding" :class="$style.padding">浏览排行</h3>
		<ol v-if="hots" class="rank">

			<!-- 这里要保持<a>元素的链接便于爬虫跟进，不能直接把<router-link>搞成<li> -->
			<li v-for="article in hots" :key="article.id">
				<router-link
					:to="article | articleLink"
					class="item">
					{{article.title}}
				</router-link>
			</li>
		</ol>
		<p :class="$style.noContent" v-else>加载失败</p>
	</aside>
</template>

<script>
import api from "../../api";

export default {
	name: "AsidePanel",
	data() {
		const store = this.$store.state.prefetch;
		if (store) {
			return { hots: store.hots };
		}
		return { hots: null };
	},
	beforeMount() {
		if (!this.hots)
			api.article.getHots().then(hots => this.hots = hots);
	},
};
</script>

<style module lang="less">
.padding {
	padding-top: .2em;
	padding-bottom: .2em;
}

.noContent {
	text-align: center;
}
</style>
