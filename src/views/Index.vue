<template>
	<div id="index-page">
		<main>
			<h1 class='segment' v-if="categoryPath">
				<a href='/index' target='_self'>全部文章</a>
				<a target='_self'
				   :key="category.id"
				   v-for="category of excludeLast(categoryPath)"
				   :href="'/index?category=' + category.id">&gt; {{category.name}}</a>
				<span>&gt; {{categoryPath[categoryPath.length-1].name}}</span>
			</h1>
			<h1 class='segment' v-else>全部文章</h1>

			<article-preview :key="article.id"
							 :item="article"
							 v-for="article in articles">
			</article-preview>

			<scroll-pager :options="pagerConfig"
						  @load-page="loadPage">
			</scroll-pager>
		</main>
		<aside-panel></aside-panel>
	</div>
</template>

<script>
import ArticlePreview from "../components/ArticlePreview.vue";
import AsidePanel from "../components/AsidePanel.vue";
import ScrollPager from "../components/ScrollPager.vue";
import apis from "../apis.js";
import * as utils from "../utils";

export default {
	name: "Index",
	components: {
		ArticlePreview,
		AsidePanel,
		ScrollPager,
	},
	data() {
		return {
			startPage: parseInt(utils.getQueryString("start") || "0"),
			articles: [],
			pageSize: 16,
			categoryPath: null,
		};
	},
	computed: {
		pagerConfig() {
			const config = {
				tradition: utils.getQueryString("tradition") === "true",
			};
			if (utils.getQueryString("manually") === "true") {
				const nextStart = this.startPage + this.articles.length;
				const url = new URL(window.location.href);

				url.searchParams.set("start", nextStart.toString());
				config.manually = true;
				config.nextPageLink = url.toString();
			}
			return config;
		},
	},
	created() {
		const category = utils.getQueryString("category");
		if (category) {
			apis.category.getPath(category).then(path => this.categoryPath = path);
		}
	},
	methods: {
		async loadPage(task) {
			const category = utils.getQueryString("category") || null;
			const index = this.startPage + this.articles.length;

			try {
				const res = await apis.article.getList(category, index, this.pageSize);
				[].push.apply(this.articles, res);
				task.complete(res.length < this.pageSize);
			} catch (e) {
				return task.error(e);
			} finally {
				this.$nextTick(utils.markRenderComplete);
			}
		},
		excludeLast(arr) {
			return [...arr].splice(0, arr.length - 1);
		},
	},
};
</script>

<style lang="less">
	@import "../css/ToBeImpoert.less";

	#index-page {
		display: flex;
		align-items: flex-start;

		@media screen {
			@media (min-width: @length-screen-mobile) {max-width: 90%}
			@media (min-width: @length-screen-wide) {max-width: 82%}
		}
		margin: 0 auto;

		& > main {
			flex-grow: 1;
		}

		& > aside {
			width: 29%;
			flex: 0 0 auto;
			display: none;

			@media screen {
				@media (min-width: @length-screen-pad) {
					display: flex;
					margin-left: 3rem;
				}
			}
		}
	}
</style>
