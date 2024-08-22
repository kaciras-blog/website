<!--
	【列表的 Tag 选择】比起 ul+li，使用 article 能减少一层元素；
	另外从语义上讲，预览类似于 product card，其内容是独立的，所以用 article 没问题。

	MDN 上也推荐用 article 做 product card：
	https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
-->
<template>
	<BannerPageLayout :banner='category.banner'>
		<PageMeta title='所有文章' body-class=''/>

		<div id='index-page'>
			<main :class='$style.list'>
				<h1 :class='$style.title'>
					全部文章
				</h1>
				<ScrollPagingView
					ref='listView'
					v-model='articles'
					:loader='loadPage'
					:start='startPos'
					:page-size='DEFAULT_PAGE_SIZE'
					:next-link='nextPageUrl'
					:auto-load='autoLoad'
				>
					<template v-slot='{ items }'>
						<PreviewItem
							v-for='item of items'
							:item='item'
							:key='item.id'
						/>
					</template>
				</ScrollPagingView>
			</main>

			<aside :class='$style.aside'>
				<h3 :class='$style.padding'>
					浏览排行
				</h3>
				<HotArticles/>

				<h3 :class='$style.padding'>
					设置
				</h3>
				<KxSwitchBox
					name='auto-load'
					v-model='autoLoad'
				>
					滚动加载
				</KxSwitchBox>
			</aside>
		</div>
	</BannerPageLayout>
</template>

<script lang="ts">
import { PrefetchContext } from "@/prefetch.ts";

const DEFAULT_PAGE_SIZE = 10;

export default {
	name: "ListPage",
	asyncData(session: PrefetchContext) {
		const { data, route, api: { article, category } } = session;

		let start = parseInt(route.params.index as string);
		start *= DEFAULT_PAGE_SIZE;

		data.category = category.findById(0);
		data.hots = article.getHots();
		data.articleList = article
			.getList({ start, count: DEFAULT_PAGE_SIZE });
	},
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useBreakPoint, ScrollPagingView, KxSwitchBox } from "@kaciras-blog/uikit";
import api from "@/api/index.ts";
import { usePrefetch } from "@/store/index.ts";
import BannerPageLayout from "@/components/BannerPageLayout.vue";
import PreviewItem from "./PreviewItem.vue";
import HotArticles from "./HotArticles.vue";
import PageMeta from "@/components/PageMeta.ts";

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
</script>

<style module lang="less">
@import "../../css/imports.less";

:global(#index-page) {
	display: flex;
	gap: 7%;
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
			gap: 120px;
			max-width: 84%;
		}
	}
}

.list {
	flex-grow: 1;
	max-width: 64rem;
}

.title {
	composes: segment from global;

	font-size: 1.8rem;
	text-align: center;

	@media screen and (min-width: @length-screen-mobile) {
		text-align: left;
	}
}

.aside {
	/* sticky 在支持 Grid 的浏览器上都可用，但是 table 里面使用有些问题 */
	position: sticky;
	top: 30px;

	width: 29%;
	max-width: 30em;

	flex: 0 0 auto;

	@media screen and (max-width: @length-screen-mobile){
		display: none;
	}
}

.padding {
	border-left: 8px solid @color-primary-light;
	padding-left: 10px;
	padding-top: .2em;
	padding-bottom: .2em;
	line-height: initial;
}
</style>
