<template>
	<banner-page-layout :class="$style.container" :banner="article.banner">

		<article :class="$style.article">
			<header class="segment" :class="$style.header">
				<h1 :class="$style.title">{{article.title}}</h1>
				<p>
					<span>发布时间：</span>
					<time>{{article.create | localDateMinute}}</time>
				</p>
				<p>
					<span>最后更新：</span>
					<time>{{article.update | localDateMinute}}</time>
				</p>
				<div>
					<span>关键词：</span>
					<span
						v-for="keyword in article.keywords"
						:key="keyword"
						:class="$style.keyword"
					>
						{{keyword}}
					</span>
				</div>
			</header>

			<markdown-view
				class="segment"
				:value="article.content"
				is-article="true"
			/>
		</article>

		<discussion-section
			ref="discussion"
			:object-id="article.id"
			:type="0"
			:class="$style.discuss_section"
		/>

		<div
			v-if="$mediaQuery.match('tablet+')"
			class="side-buttons compact vertical-btn-group"
		>
			<kx-button
				class="primary outline"
				title="转到评论区"
				@click="gotoDiscuss"
			>
				<i class="far fa-comments"></i>
			</kx-button>
			<kx-button
				class="primary outline"
				title="回顶部"
				@click="gotoTop"
			>
				<i class="fas fa-chevron-up"></i>
			</kx-button>
		</div>
	</banner-page-layout>
</template>

<script>
import { mapState } from "vuex";
import { scrollToElementStart } from "@kaciras-blog/uikit";
import TitleMixin from "@/title-mixin";
import { articleLink } from "@/blog-plugin";
import { escapeHtml } from "@/utils";
import MarkdownView from "@/markdown/MarkdownView";

export default {
	name: "ArticlePage",
	components: {
		MarkdownView,
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

		await session.api
			.withCancelToken(session.cancelToken)
			.article.get(id)
			.then(session.dataSetter("article"));

		// 检查URL中的标题，不正确则重定向到正确的 URL，这里直接抛出对象不知道好不好
		const correctUrlTitle = session.data.article.urlTitle;
		if (!urlTitle || urlTitle !== correctUrlTitle) {
			throw { code: 301, location: `/article/${id}/${correctUrlTitle}` };
		}
	},
	computed: mapState({
		article: state => state.prefetch.article,
	}),
	methods: {
		gotoTop() {
			scrollToElementStart(document.documentElement);
		},
		gotoDiscuss() {
			scrollToElementStart(this.$refs.discussion.$el);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	@media screen and (min-width: @length-screen-pad) {
		--background-size: cover;
	}
}

.article {
	margin: 0 auto;
	padding: 30px 1em 0;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			width: 90vw;
			padding-top: 50px;
		}
		@media (min-width: @length-screen-pad) {
			width: 78vw;
		}
		@media (min-width: @length-screen-wide) {
			width: 66vw;
			max-width: 1000px;
		}
	}
}

.header {
	text-align: center;
}

.title {
	font-size: 2rem;
}

.keyword {
	margin-right: .3em;
}

.discuss_section {
	margin: 50px auto;
	padding: 0 1rem;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 30px;
		}
		@media (min-width: @length-screen-pad) {
			width: 85vw;
		}
		@media (min-width: @length-screen-wide) {
			width: 75vw;
			max-width: 1500px;
		}
	}
}
</style>
