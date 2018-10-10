<template>
	<page-layout
		view-id="index-page"
		:class="$style.navVaribles"
		:banner="true"
		:footer="true">

		<section :class="$style.list">
			<h1 class="segment" :class="$style.listTitle">全部文章</h1>

			<scroll-pageing-view
				:loader="loadPage"
				:init-items="initArticles"
				:init-state="initState"
				:init-next-url="initNextUrl">

				<ul class="list" slot-scope="{ items }">
					<article-preview-item
						v-for="item of items"
						:key="item.id"
						:item="item"
						class="segment"/>
				</ul>
			</scroll-pageing-view>
		</section>

		<aside-panel/>
	</page-layout>
</template>

<script>
import AsidePanel from "./AsidePanel.vue";
import ArticlePreviewItem from "./ArticlePreviewItem.vue";
import api from "../../api.js";

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
		hots: null,
		items: null,
	}),
	actions: {
		fetchItem({ commit }, {start, origin}) {
			const loadHots = api.recommend.getHotArticles().then(items => commit("setHots", items));
			const loadList = api.article.getList(0, start || 0, 16).then(items => commit("setItems", items));
			return Promise.all([loadList, loadHots]);
		},
	},
	mutations: {
		setItems: (state, items) => state.items = items,
		setHots: (state, items) => state.hots = items,
	},
};

export default {
	name: "IndexPage",
	components: {
		ArticlePreviewItem,
		AsidePanel,
	},
	async asyncData(store, route, origin) {
		store.registerModule("index", indexStoreModule);
		return store.dispatch("index/fetchItem", { start: route.params.index, origin });
	},
	data() {
		const data = {
			category: this.$route.query.category,
			cpath: null,
			index: parseInt(this.$route.params.index) || 0,

			initArticles: [],
			initNextUrl: null,
			initState: "FREE",
		};

		const store = this.$store.state.index;
		if (store) {
			data.initArticles = store.items;
			data.initNextUrl = nextPageUrl(this.$route, store.items.length);
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
	},
	destroyed() {
		if (this.$store.state.index) {
			this.$store.unregisterModule("index");
		}
	},
};
</script>

<style module lang="less">
@import "../../css/ToBeImport";

:global(#index-page) {
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
				margin-left: 6%;
			}
		}
	}
}

.list {
	flex-grow: 1;
}

.listTitle {
	font-size: 1.8rem;
	text-align: center;
	@media screen and (min-width: @length-screen-mobile) {
		text-align: left;
	}
}

.navVaribles {
	--background: url("../../assets/index-banner.jpg") center 0;
	--background-size: cover;
}
</style>
