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

			<scroll-pageing-view :init-items="initArticles" :loader="loadPage">
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

const indexStoreModule = {
	namespaced: true,
	state: () => ({
		items: null,
	}),
	actions: {
		fetchItem({ commit }, category, index) {
			return api.article.getList(category, index, 16).then(items => commit("setItems", items));
		},
	},
	mutations: {
		setItems: (state, items) => state.items = items,
	},
};

export default {
	name: "Index",
	components: {
		ArticlePreview,
		AsidePanel,
	},
	asyncData({store, route}) {
		store.registerModule("index", indexStoreModule);
		return store.dispatch("index/fetchItem", 0, route.params.index);
	},
	props: {
		index: {
			type: Number,
			default: 0,
		},
	},
	data() {
		const store = this.$store.state.index;
		return {
			category: this.$route.query.category,
			cpath: null,
			initArticles: store ? store.items : [],
		};
	},
	methods: {
		async loadPage(items, size) {
			const { $route, category, index } = this;
			const loaded = await api.article.getList(category, index + items.length, size);
			items.push.apply(items, loaded);

			// 拼URL
			const params = Object.assign({}, $route.query);
			const pairs = [];
			for (const k of Object.keys(params)) {
				pairs.push(k + "=" + params[k]);
			}
			const nextPath =  "/page/" + (index + items.length);
			return pairs.length ? nextPath + "?" + pairs.join("&") : nextPath;
		},
		excludeLast(arr) {
			return [...arr].splice(0, arr.length - 1);
		},
	},
	destroyed() {
		if(this.$store.state.index) {
			this.$store.unregisterModule("index");
		}
	},
};
</script>

<!--suppress CssNoGenericFontName -->
<style lang="less">
@import "../css/ToBeImpoert";

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
	--background: url("../assets/index-banner.jpg") center 0;
	--background-size: cover;
}
</style>
