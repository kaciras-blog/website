<template>
	<div>
		<div class="background"></div>

		<div class="flex serrated container-wide">
			<section class="flex expansion vertical panel">

				<h1 class='compact header' v-if="categoryPath">
					<a href='/index' target='_self'>全部文章</a>
					<a target='_self'
					   :key="category.id"
					   v-for="category of excludeLast(categoryPath)"
					   :href="'/index?category=' + category.id">&gt; {{category.name}}</a>
					<span>&gt; {{categoryPath[categoryPath.length-1].name}}</span>
				</h1>
				<h1 class='compact header' v-else>全部文章</h1>

				<hr>
				<article-preview :key="article.id"
								 :item="article"
								 v-for="article in articles">
				</article-preview>
				<scroll-pager :options="pagerConfig" @load-page="loadPage"></scroll-pager>
			</section>
			<aside-panel></aside-panel>
		</div>
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
			}
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
					config.nextPageLink = url.toString()
				}
				return config
			}
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
					this.$nextTick(utils.markRenderComplete)
				}
			},
			excludeLast(arr) {
				return [...arr].splice(0, arr.length - 1);
			},
		},
	}
</script>

<style scoped lang="less">
	@import "../css/Filter.less";

	#top-nav {
		.glass;
		.glass.blur(4px);

		&::before {
			background-image: url("../assets/index-header.jpg");
			background-size: cover;
		}
	}

	.background {
		height: 180px;
		width: 100%;
		background-image: url("../assets/index-header.jpg");
		@media screen and (min-width: 768px) {
			margin-bottom: 3rem;
		}
	}

	.background, #top-nav::before {
		background-position: center 0;
		background-size: cover;
	}
</style>
