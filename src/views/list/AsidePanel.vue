<template>
	<div>
		<h3 :class="$style.padding">浏览排行</h3>
		<ol v-if="hots" class="rank-list">

			<!-- 这里要保持<a>元素的链接，不能直接把<router-link>搞成<li> -->
			<li
				v-for="article of hots"
				:key="article.id"
			>
				<router-link
					:to="article | articleLink"
					class="item"
				>
					{{article.title}}
				</router-link>
			</li>
		</ol>
		<p :class="$style.noContent" v-else>加载失败</p>
	</div>
</template>

<script>
import api from "@/api";

export default {
	name: "AsidePanel",
	data() {
		const store = this.$store.state.prefetch;
		if (store) {
			return { hots: store.hots };
		}
		return { hots: null };
	},
	async beforeMount() {
		if (!this.hots) {
			this.hots = await api.article.getHots();
		}
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.noContent {
	text-align: center;
}

.padding {
	border-left: 8px solid @color-primary-light;
	padding-left: 10px;
	padding-top: .2em;
	padding-bottom: .2em;
	line-height: initial;
}
</style>
