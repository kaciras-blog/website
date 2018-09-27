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
				:loader="loadPage"
				:init-items="initArticles"
				:init-state="initState"
				:init-next-url="nextUrl">
				<article-preview slot-scope="{ item }" :key="item.id" :item="item"/>
			</scroll-pageing-view>
		</div>
		<aside-panel></aside-panel>
	</page-layout>
</template>

<script>
import AsidePanel from "./AsidePanel.vue";
import ArticlePreview from "./ArticlePreview.vue";
import api from "../../apis.js";

/**
 * 根据路由和当前加载的文章数来构造下一页的URL。
 * @param route 路由信息对象
 * @param count 加载的文章数
 * @return {string} 指向下一页的URL，相对路径
 */
function nextPageUrl(route, count) {
	const params = Object.assign({}, route.query);
	const pairs = [];
	for (const k of Object.keys(params)) {
		pairs.push(k + "=" + params[k]);
	}
	const nextPath = "/page/" + ((parseInt(route.params.index) || 0) + count);
	return pairs.length ? nextPath + "?" + pairs.join("&") : nextPath;
}

const indexStoreModule = {
	namespaced: true,
	state: () => ({
		items: null,
	}),
	actions: {
		fetchItem({ commit }, route) {
			return api.article.getList(0, route.params.index || 0, 16).then(items => commit("setItems", items));
		},
	},
	mutations: {
		setItems: (state, items) => state.items = items,
	},
};

export default {
	name: "IndexPage",
	components: {
		ArticlePreview,
		AsidePanel,
	},
	asyncData({ store, route }) {
		store.registerModule("index", indexStoreModule);
		return store.dispatch("index/fetchItem", route);
	},
	data() {
		const data = {
			category: this.$route.query.category,
			cpath: null,
			initArticles: [],
			nextUrl: null,
			index: parseInt(this.$route.params.index) || 0,
		};

		const store = this.$store.state.index;
		if (store) {
			data.initArticles = store.items;
			data.nextUrl = nextPageUrl(this.$route, store.items.length);
			data.initState = store.items.length >= 16 ? "FREE" : "ALL_LOADED";
		}
		return data;
	},
	methods: {
		async loadPage(items, size) {
			const { $route, category, index } = this;
			const loaded = await api.article.getList(category, index + items.length, size);
			items.push.apply(items, loaded);
			return nextPageUrl($route, items.length);
		},
		excludeLast(arr) {
			return [...arr].splice(0, arr.length - 1);
		},
	},
	destroyed() {
		if (this.$store.state.index) {
			this.$store.unregisterModule("index");
		}
	},
};
</script>

<!--suppress CssNoGenericFontName -->
<style lang="less">
@import "../../css/ToBeImpoert";

#index-page {
	display: flex;
	align-items: flex-start;
	min-height: 100vh;

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
	--background: url("../../assets/index-banner.jpg") center 0;
	--background-size: cover;
}
</style>
