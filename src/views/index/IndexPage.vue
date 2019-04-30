<template>
	<page-layout
		view-id="index-page"
		:show-banner="true"
		:banner="category.banner">

		<section :class="$style.list">
			<h1 class="segment" :class="$style.listTitle">全部文章</h1>

			<scroll-paging-view
				:auto-load="autoLoad"
				:next-link-enabled="true"
				:loader="loadPage"
				:page-size="2"
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
			</scroll-paging-view>
		</section>

		<aside :class="$style.aside">
			<aside-panel />
			<kx-check-box v-model="autoLoad">滚动加载</kx-check-box>
		</aside>

	</page-layout>
</template>

<script>
import { mapState } from "vuex";
import AsidePanel from "./AsidePanel";
import ArticlePreviewItem from "./ArticlePreviewItem";
import api from "../../api";

const DEFAULT_PAGE_SIZE = 2;

/**
 * 根据路由和当前加载的文章数来构造下一页的URL。
 *
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

export default {
	name: "IndexPage",
	components: {
		ArticlePreviewItem,
		AsidePanel,
	},
	async asyncData (session) {
		const configuredApi = api
			.withCancelToken(session.cancelToken)
			.withPrototype(session.request);

		const tasks = [
			configuredApi.category.get(0).then(session.dataSetter("category")),
		];

		if (session.isServer) {
			const routeParams = session.route.params;

			tasks.push(configuredApi.article.getList({ start: routeParams.index, count: DEFAULT_PAGE_SIZE })
				.then(session.dataSetter("items")));

			tasks.push(configuredApi.article.getHots().then(session.dataSetter("hots")));
		}

		return Promise.all(tasks);
	},
	data () {
		const data = {
			autoLoad: true,

			index: parseInt(this.$route.params.index) || 0,
			initArticles: [],
			initNextUrl: null,
			initState: "FREE",
		};

		// 预加载的文章只是第一页，后续还会加载更多所以放入data而不是计算属性。
		const store = this.$store.state.prefetch;
		if (store.items) {
			data.initArticles = store.items;
			data.initNextUrl = nextPageUrl(this.$route, store.items.length);
			data.initState = store.items.length >= DEFAULT_PAGE_SIZE ? "FREE" : "ALL_LOADED";
		}
		return data;
	},
	computed: mapState({
		category: state => state.prefetch.category,
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
