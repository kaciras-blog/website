<template>
	<banner-page-layout :banner="category.banner">

		<div id="index-page">
			<section :class="$style.list">
				<h1 class="segment" :class="$style.listTitle">全部文章</h1>

				<scroll-paging-view
					ref="pagingView"
					v-model="articleList"
					:loader="loadPage"
					:start="startPos"
					:page-size="10"
					:next-link="nextPageUrl"
					:auto-load="autoLoad"
				>
					<template v-slot="{ items }">
						<ul class="clean-list">
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
				<aside-panel/>

				<h3 class="padding">设置</h3>
				<label :class="$style.switch_option">
					<span :class="$style.switch_label">滚动加载</span>
					<kx-switch v-model="autoLoad"/>
				</label>

			</aside>
		</div>
	</banner-page-layout>
</template>

<script>
import { mapState } from "vuex";
import api from "@/api";
import AsidePanel from "./AsidePanel";
import ArticlePreviewItem from "./ArticlePreviewItem";

const DEFAULT_PAGE_SIZE = 10;

export default {
	name: "ArticleListPage",
	components: {
		ArticlePreviewItem,
		AsidePanel,
	},
	async asyncData(session) {
		const configuredApi = api.withCancelToken(session.cancelToken).withPrototype(session.request);

		const tasks = [
			configuredApi.category.get(0).then(session.dataSetter("category")),
		];

		if (session.isServer) {
			const routeParams = session.route.params;

			tasks.push(configuredApi.article
				.getList({ start: routeParams.index, count: DEFAULT_PAGE_SIZE })
				.then(session.dataSetter("articleList")));

			tasks.push(configuredApi.article.getHots().then(session.dataSetter("hots")));
		}

		return Promise.all(tasks);
	},
	data() {
		const data = {
			autoLoad: this.$mediaQuery.match("mobile"),
			startPos: parseInt(this.$route.params.index) || 0,
			articleList: null,
		};

		// 预加载的文章只是第一页，后续还会加载更多所以放入data而不是计算属性。
		const { articleList } = this.$store.state.prefetch;
		if (articleList) {
			data.articleList = articleList;
			data.startPos += articleList.items.length;
		}
		return data;
	},
	computed: mapState({
		category: state => state.prefetch.category,
	}),
	watch: {
		autoLoad(value) {
			localStorage.setItem("scrollPager.autoLoad", JSON.stringify(value));
		},
	},
	methods: {
		loadPage(start, count) {
			return api.article.getList({ start, count });
		},
		/**
		 * 根据路由和当前加载的文章数来构造下一页的URL。
		 *
		 * @param start 下一页起始位置
		 * @param count 每页显示多少个
		 * @return 指向下一页的URL，相对路径
		 */
		nextPageUrl(start, count) {
			const params = Object.assign({}, this.$route.query);
			const pairs = [];
			for (const k of Object.keys(params)) {
				pairs.push(k + "=" + params[k]);
			}
			const nextPath = "/list/" + ((parseInt(this.$route.params.index) || 0) + count);
			return pairs.length ? nextPath + "?" + pairs.join("&") : nextPath;
		},
	},
	beforeMount() {
		const storedLoad = localStorage.getItem("scrollPager.autoLoad");
		if (storedLoad) {
			this.autoLoad = JSON.parse(storedLoad);
		}
	},
	mounted() {
		if(!this.articleList) {
			this.$refs.pagingView.loadPage();
		}
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

:global(#index-page) {
	display: flex;
	align-items: flex-start;
	min-height: 100vh;
	margin: 0 auto;
	padding-top: 30px;
	padding-bottom: 70px;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			max-width: 90%;
			padding-top: 50px;
		}
		@media (min-width: @length-screen-wide) {
			max-width: 82%;
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
	// sticky在支持Grid的浏览器上都可用，但是table里面使用有些问题
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

.switch_option {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.switch_label {
	margin-right: auto;
	font-size: 16px;
}
</style>
