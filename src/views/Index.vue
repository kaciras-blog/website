<template>
	<main id="index-page">
		<div class="article-list">
			<h1 class='segment' v-if="categoryPath">
				<router-link to='/'>全部文章</router-link>
				<router-link v-for="category of excludeLast(categoryPath)"
							 :key="category.id"
							 :to="'/index?category=' + category.id">&gt; {{category.name}}
				</router-link>
				<span>&gt; {{categoryPath[categoryPath.length-1].name}}</span>
			</h1>
			<h1 class='segment' v-else>全部文章</h1>

			<article-preview
				v-for="article of articles"
				:key="article.id"
				:item="article"/>

			<scroll-pager
				:options="pagerConfig"
				@load-page="loadPage"/>
		</div>
		<aside-panel></aside-panel>
	</main>
</template>

<script>
import ArticlePreview from "../components/ArticlePreview.vue";
import AsidePanel from "../components/AsidePanel.vue";
import api from "../apis.js";
import * as utils from "../utils";

export default {
	name: "Index",
	components: {
		ArticlePreview,
		AsidePanel,
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
			api.category.getPath(category).then(path => this.categoryPath = path);
		}

		this.$emit("layoutChanged", { clazz: "index-header", banner: true }, true);
	},
	methods: {
		async loadPage(task) {
			const category = utils.getQueryString("category") || null;
			const index = this.startPage + this.articles.length;

			try {
				const res = await api.article.getList(category, index, this.pageSize);
				this.articles.push.apply(this.articles, res);
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
@import "../css/ToBeImpoert";

#index-page {
	display: flex;
	align-items: flex-start;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			max-width: 90%
		}
		@media (min-width: @length-screen-wide) {
			max-width: 82%
		}
	}
	margin: 0 auto;

	& > aside {
		width: 29%;
		flex: 0 0 auto;
		display: none;

		@media screen {
			@media (min-width: @length-screen-pad) {
				display: block;
				margin-left: 4rem;
			}
		}
	}
}

.article-list {
	flex-grow: 1;

	& > h1 {
		text-align: center;
		@media screen and (min-width: @length-screen-mobile) {
			text-align: left;
		}
	}
}

.index-header #banner,
.index-header #top-nav::before {
	background: url("../assets/index-banner.jpg") center 0;
	background-size: cover;
}
</style>
