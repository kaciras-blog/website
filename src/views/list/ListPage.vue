<template>
	<banner-page-layout :banner="category.banner">
		<PageMeta title="所有文章"/>

		<div id="index-page">
			<section :class="$style.list">
				<h1 class="segment" :class="$style.listTitle">
					全部文章
				</h1>
				<scroll-paging-view
					ref="listView"
					v-model="articles"
					:loader="loadPage"
					:start="startPos"
					:page-size="DEFAULT_PAGE_SIZE"
					:next-link="nextPageUrl"
					:auto-load="autoLoad"
				>
					<template v-slot="{ items }">
						<ul class="clean-list">
							<preview-item
								v-for="item of items"
								:key="item.id"
								:item="item"
								class="segment"
							/>
						</ul>
					</template>
				</scroll-paging-view>
			</section>

			<aside :class="$style.aside">
				<aside-panel></aside-panel>

				<h3 class="padding">设置</h3>
				<kx-switch-box name="auto-load" v-model="autoLoad">
					滚动加载
				</kx-switch-box>
			</aside>
		</div>
	</banner-page-layout>
</template>

<script lang="ts">
import { PrefetchContext } from "@/prefetch";

const DEFAULT_PAGE_SIZE = 10;

export default {
	name: "ArticleListPage",
	asyncData(session: PrefetchContext) {
		const { article, category } = session.api;

		let start = parseInt(session.route.params.index as string);
		start *= DEFAULT_PAGE_SIZE;

		session.data.category = category.get(0);
		session.data.hots = article.getHots();
		session.data.articleList = article
			.getList({ start, count: DEFAULT_PAGE_SIZE });
	},
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useBreakPoint, ScrollPagingView, KxSwitchBox } from "@kaciras-blog/uikit";
import api from "@/api";
import { usePrefetch } from "@/store";
import BannerPageLayout from "@/components/BannerPageLayout.vue";
import PreviewItem from "./PreviewItem.vue";
import AsidePanel from "./AsidePanel.vue";
import PageMeta from "@/components/PageMeta";

const breakPoint = useBreakPoint();
const route = useRoute();
const prefetch = usePrefetch();

const { articleList, category } = prefetch.data;

let startPos = parseInt(route.params.index as string) || 0;
startPos *= DEFAULT_PAGE_SIZE;

const listView = ref();
const autoLoad = useLocalStorage("ListPage:autoLoad", breakPoint.value === "mobile");
const articles = ref(articleList);

function loadPage(start: number, count: number) {
	return api.article.getList({ start, count });
}

/**
 * 根据路由和当前加载的文章数来构造下一页的 URL。
 *
 * @return 指向下一页的 URL，相对路径
 */
function nextPageUrl() {
	const { query, params } = route;
	const index = parseInt(params.index as string);

	const qs = new URLSearchParams(query as any).toString();
	const path = `/list/${index + 1}`;
	return qs ? `${path}?${qs}` : path;
}

// watch(autoLoad, v => v && listView.value.loadNext());
</script>

<style module lang="less">
@import "../../css/imports";

:global(#index-page) {
	display: flex;
	justify-content: center;
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
			max-width: 84%;
		}
	}
}

.list {
	flex-grow: 1;
	max-width: 64rem;
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
	max-width: 30em;

	flex: 0 0 auto;
	display: none;

	@media screen {
		@media (min-width: @length-screen-pad) {
			display: block;
			margin-left: 8%;
		}
	}
}
</style>
