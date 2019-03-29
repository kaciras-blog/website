<template>
	<page-layout
		view-id="index-page"
		:show-banner="true"
		:banner="category.banner">

		<section :class="$style.list">
			<h1 class="segment" :class="$style.listTitle">全部文章</h1>

			<scroll-pageing-view
				:next-link-enabled="true"
				:loader="loadPage"
				:init-items="initArticles"
				:init-state="initState"
				:init-next-url="initNextUrl">

				<template v-slot="{ items }">
					<ul class="list">
						<article-preview-item
							v-for="item of items"
							:key="item.id"
							:item="item"
							class="segment"/>
					</ul>
				</template>
			</scroll-pageing-view>
		</section>
		<aside-panel :class="$style.aside"/>
	</page-layout>
</template>

<script>
import { mapState } from "vuex";
import AsidePanel from "./AsidePanel";
import ArticlePreviewItem from "./ArticlePreviewItem";
import api from "../../api";

const DEFAULT_PAGE_SIZE = 16;

/**
 * 根据路由和当前加载的文章数来构造下一页的URL。
 * @param route 路由信息对象
 * @param count 加载的文章数
 * @return 指向下一页的URL，相对路径
 */
function nextPageUrl (route, count) {
	const params = Object.assign({}, route.query);
	const pairs = [];
	for (const k of Object.keys(params)) {
		pairs.push(k + "=" + params[k]);
	}
	const nextPath = "/list/" + ((parseInt(route.params.index) || 0) + count);
	return pairs.length ? nextPath + "?" + pairs.join("&") : nextPath;
}

const indexStoreModule = {
	namespaced: true,
	state: () => ({
		category: {},
		hots: null,
		items: null,
	}),
	actions: {
		fetchItem ({ commit }, { start, cancelToken, prototype, isServer }) {
			const configuredApi = api.withCancelToken(cancelToken).withPrototype(prototype);
			const tasks = [];

			if (isServer) {
				tasks.push(configuredApi.article.getHots()
					.then(items => commit("setHots", items)));
				tasks.push(configuredApi.article.getList({ start, count: DEFAULT_PAGE_SIZE })
					.then(items => commit("setItems", items)));
			}

			tasks.push(configuredApi.category.get(0)
				.then(items => commit("setCategory", items)));

			return Promise.all(tasks);
		},
	},
	mutations: {
		setItems: (state, items) => state.items = items,
		setHots: (state, items) => state.hots = items,
		setCategory: (state, item) => state.category = item,
	},
};

export default {
	name: "IndexPage",
	components: {
		ArticlePreviewItem,
		AsidePanel,
	},
	async asyncData ({ store, route, cancelToken, prototype, isServer }) {
		store.registerModule("index", indexStoreModule);
		return store.dispatch("index/fetchItem", { start: route.params.index, cancelToken, prototype, isServer });
	},
	data () {
		const data = {
			index: parseInt(this.$route.params.index) || 0,
			initArticles: [],
			initNextUrl: null,
			initState: "FREE",
		};

		// 预加载的文章只是第一页，后续还会加载更多所以放入data而不是计算属性。
		const store = this.$store.state.index;
		if (store.items) {
			data.initArticles = store.items;
			data.initNextUrl = nextPageUrl(this.$route, store.items.length);
			data.initState = store.items.length >= DEFAULT_PAGE_SIZE ? "FREE" : "ALL_LOADED";
		}
		return data;
	},
	computed: mapState({
		category: state => state.index.category,
	}),
	methods: {
		async loadPage (items, size) {
			const { $route, index } = this;
			const loaded = await api.article.getList({
				start: index + items.length,
				count: size,
			});
			items.push.apply(items, loaded);
			return nextPageUrl($route, items.length);
		},
	},
	destroyed () {
		this.$store.unregisterModule("index");
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

:global(#index-page) {
	display: flex;
	align-items: flex-start;
	min-height: 100vh;
	margin: 0 auto 4rem auto;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			max-width: 90%
		}
		@media (min-width: @length-screen-wide) {
			max-width: 82%
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

.aside {
	position: sticky;
	top: 30px;

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
</style>
