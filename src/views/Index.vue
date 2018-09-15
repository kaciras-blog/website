<template>
	<page-layout view-id="index-page"
				 nav-class="index-header"
				 :banner="true"
				 :footer="true">

		<div class="article-list">

			<h1 class='segment' v-if="cpath">
				<router-link to='/'>全部文章</router-link>
				<router-link
					v-for="cat of excludeLast(cpath)"
					:key="cat.id"
					:to="'/index?category=' + cat.id">&gt; {{cat.name}}
				</router-link>
				<span>&gt; {{cpath[cpath.length-1].name}}</span>
			</h1>
			<h1 class='segment' v-else>全部文章</h1>

			<scroll-pageing-view
				:url-template="nextPage"
				:start="startPage"
				:loader="loadPage">

				<article-preview slot-scope="{ item }" :key="item.id" :item="item"/>
			</scroll-pageing-view>
		</div>
		<aside-panel></aside-panel>
	</page-layout>
</template>

<script>
import ArticlePreview from "../components/ArticlePreview.vue";
import AsidePanel from "../components/AsidePanel.vue";
import api from "../apis.js";
import {getQueryString} from "../utils";

export default {
	name: "Index",
	components: {
		ArticlePreview,
		AsidePanel,
	},
	data() {
		return {
			startPage: parseInt(getQueryString("start") || "0"),
			category: getQueryString("category"),
			pageSize: 16,
			cpath: null,
		};
	},
	created() {
		const category = this.category;
		if (category) {
			api.category.getPath(category).then(path => this.cpath = path);
		}
	},
	methods: {
		loadPage(index, size) {
			return api.article.getList(this.category, index, size);
		},
		nextPage(index) {
			const url = new URL(window.location.href);
			url.searchParams.set("start", index);
			return url;
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

.index-header {
	--background: url("../assets/index-banner.jpg") center 0;
	--background-size: cover;
}
</style>
