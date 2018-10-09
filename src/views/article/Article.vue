<template>
	<page-layout
		view-id="article-page"
		:style="navStyle"
		:banner="true"
		:footer="true">

		<article-view :value="article"/>

		<discuss-panel
			:article-id="article.id"
			ref="discssPanel"/>

		<div class="side-buttons compact vertical-btn-group">
			<kx-button
				class="primary outline"
				title="转到评论区"
				@click="gotodiscuss">
				<i class="far fa-comments"></i>
			</kx-button>
			<kx-button
				class="primary outline"
				title="回顶部"
				@click="gotoTop">
				<i class="fas fa-chevron-up"></i>
			</kx-button>
		</div>
	</page-layout>
</template>

<script>
import DiscussPanel from "./DiscussPanel";
import ArticleView from "./ArticleView";
import TitleMixin from "../../title-mixin";
import { escapeHtml, scrollToElementStart } from "../../utils";
import api from "../../api";
import $ from "jquery";
import { mapState } from "vuex";
import articleLink from "../../article-url-mixin";
import axios from "axios";


const storeModule = {
	namespaced: true,
	state: () => ({
		item: {},
	}),
	actions: {
		fetchItem({ commit }, { id, cancelToken }) {
			const asioxCancelToken = axios.CancelToken.source();
			cancelToken.onCancel(asioxCancelToken.cancel);
			return api.article.get(id, asioxCancelToken.token).then(item => commit("setItem", item));
		},
	},
	mutations: {
		setItem: (state, item) => state.item = item,
	},
};

export default {
	name: "Article",
	components: {
		DiscussPanel,
		ArticleView,
	},
	mixins: [TitleMixin],

	title() {
		return this.article.title;
	},
	/**
	 * 为了优化SEO，需要在预渲染的文章页面的<head>中加入一些标签。
	 *
	 * @return {string}
	 */
	metadata() {
		const { keywords, summary, prev, next } = this.article;
		let headers = `
				<meta name="description" content="${escapeHtml(summary)}">
				<meta name="keywords" content="${escapeHtml(keywords.join(","))}">`;
		if (prev) {
			headers += `<link rel="prev" title="${prev.title}" href="${articleLink(prev)}">`;
		}
		if (next) {
			headers += `<link rel="next" title="${next.title}" href="${articleLink(next)}">`;
		}
		return headers;
	},
	/**
	 * 在路由切换前加载数据。
	 *
	 * @param store 全局状态存储
	 * @param route 路由信息
	 * @param cancelToken {CancelToken}
	 * @return {Promise<void>} 指示加载状态的Promise
	 */
	async asyncData(store, route, cancelToken) {
		const { id, urlTitle } = route.params;
		const module = store.state.article;

		if (module && module.item.id === parseInt(id)) {
			return; // 重定向来的，文章已经加载过了，这里假定重定向后的urlTitle是正确的。
		}

		store.registerModule("article", storeModule);
		cancelToken.onCancel(() => store.unregisterModule("article"));
		await store.dispatch("article/fetchItem", { id, cancelToken });

		// 检查URL中的标题，不正确则重定向到正确的URL
		const correctUrlTitle = store.state.article.item.urlTitle;
		if (!urlTitle || urlTitle !== correctUrlTitle) {
			throw { code: 301, location: `/article/${id}/${correctUrlTitle}` };
		}
	},
	prefetch: true, // 在客户端是否预加载数据
	computed: {
		navStyle() {
			return { "--background": `url(${this.article.banner || require("../../assets/index-banner.jpg")})` };
		},
		...mapState({ article: state => state.article.item }),
	},
	methods: {
		gotodiscuss() {
			scrollToElementStart(this.$refs["discssPanel"].$el);
		},
		gotoTop() {
			$("html,body").animate({ scrollTop: 0 }, 300);
		},
	},
	destroyed() {
		this.$store.unregisterModule("article");
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

#article-page {

	& > article {
		padding: 0 .8rem;
		margin: 0 auto;

		@media screen {
			@media (min-width: @length-screen-mobile) {
				max-width: 90%;
			}
			@media (min-width: @length-screen-pad) {
				max-width: 78%;
			}
			@media (min-width: @length-screen-wide) {
				max-width: 66%;
			}
		}
	}

	& > .discuss {
		margin-left: auto;
		margin-right: auto;

		@media screen {
			@media (min-width: @length-screen-pad) {
				max-width: 85%;
			}
			@media (min-width: @length-screen-wide) {
				max-width: 75%;
			}
		}
	}
}

.side-buttons {
	display: flex;
	flex-direction: column;
	position: fixed;

	top: 72vh;
	right: .8rem;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			top: 60%;
			right: 1rem;
		}
		@media (min-width: @length-screen-pad) {
			right: 3%;
		}
		@media (min-width: @length-screen-wide) {
			right: 5%;
		}
	}

	& > .outline {
		margin-top: -1px;
		padding: 0;
		width: 2.3rem;
		height: 2.3rem;

		font-size: 1.4rem;
		background-color: white; // 按钮组边角

		@media screen {
			@media (min-width: @length-screen-mobile) {
				font-size: 1.8rem;
				width: 3rem;
				height: 3rem;
			}
		}
	}
}
</style>
