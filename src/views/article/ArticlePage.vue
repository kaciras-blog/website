<template>
	<banner-page-layout :class="$style.container" :banner="article.banner">

		<content-view :class="$style.article" :value="article"/>

		<discussion-section
			:object-id="article.id"
			:type="0"
			:class="$style.discuss_section"
			ref="discussPanel"/>

		<div class="side-buttons compact vertical-btn-group">
			<kx-button
				class="primary outline"
				title="转到评论区"
				@click="gotoDiscuss">
				<i class="far fa-comments"></i>
			</kx-button>
			<kx-button
				class="primary outline"
				title="回顶部"
				@click="gotoTop">
				<i class="fas fa-chevron-up"></i>
			</kx-button>
		</div>
	</banner-page-layout>
</template>

<script>
import ContentView from "./ContentView";
import TitleMixin from "../../title-mixin";
import { escapeHtml } from "../../utils";
import api from "../../api";
import { mapState } from "vuex";
import { articleLink } from "../../blog-plugin";
import { scrollToElementStart } from "kx-ui";

export default {
	name: "ArticlePage",
	components: {
		ContentView,
	},
	mixins: [TitleMixin],

	title() {
		return this.article.title;
	},
	/**
	 * 为了优化SEO，需要在预渲染的文章页面的<head>中加入一些标签。
	 *
	 * @return {string} html文本
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
	 * 在路由切换前加载数据，并检查URL是否正确。
	 *
	 * @param session 预加载会话
	 * @return {Promise<void>} 指示加载状态的Promise
	 */
	async asyncData(session) {
		const { id, urlTitle } = session.route.params;
		const { article } = session.store.state.prefetch;

		if (article && article.id === parseInt(id)) {
			return; // 重定向来的，文章已经加载过了，这里假定重定向后的urlTitle一定是正确的。
		}

		await api
			.withPrototype(session.request)
			.withCancelToken(session.cancelToken)
			.article.get(id)
			.then(session.dataSetter("article"));

		// 检查URL中的标题，不正确则重定向到正确的URL
		const correctUrlTitle = session.data.article.urlTitle;
		if (!urlTitle || urlTitle !== correctUrlTitle) {
			throw { code: 301, location: `/article/${id}/${correctUrlTitle}` };
		}
	},
	computed: {
		...mapState({ article: state => state.prefetch.article }),
	},
	methods: {
		gotoDiscuss() {
			scrollToElementStart(this.$refs.discussPanel.$el);
		},
		gotoTop() {
			scrollToElementStart(document.documentElement);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.article {
	margin: 0 auto;
	padding: 0 1em;

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

.discuss_section {
	margin: 40px auto;
	padding: 2rem .5rem;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 2rem;
		}
		@media (min-width: @length-screen-pad) {
			max-width: 85%;
		}
		@media (min-width: @length-screen-wide) {
			max-width: 75%;
		}
	}
}

.container {
	@media screen and (min-width: @length-screen-pad) {
		--background-size: cover;
	}
}
</style>
