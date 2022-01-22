<template>
	<banner-page-layout :class="$style.container" :banner="article.banner">

		<article :class="$style.article">
			<header class="segment" :class="$style.header">
				<h1 :class="$style.title">{{ article.title }}</h1>
				<p>
					<span>发布时间：</span>
					<time>{{ localDateMinute(article.create) }}</time>
				</p>
				<p>
					<span>最后更新：</span>
					<time>{{ localDateMinute(article.update) }}</time>
				</p>
				<div>
					<span>关键词：</span>
					<span
						v-for="keyword of article.keywords"
						:key="keyword"
						:class="$style.keyword"
					>
						{{ keyword }}
					</span>
				</div>
			</header>

			<markdown-view
				:value="article.content"
				:is-article="true"
				class="segment"
				:class="$style.content"
			/>
		</article>

		<discussion-section
			ref="discussion"
			:key="article.id"
			:object-id="article.id"
			:type="1"
			:class="$style.discussion"
		/>

		<div
			v-if="$mediaQuery.match('tablet+')"
			:class="$style.sideButtons"
		>
			<kx-button
				:class="$style.toolButton"
				title="转到评论"
				@click="gotoDiscuss"
			>
				<i class="far fa-comments"></i>
			</kx-button>
			<kx-button
				:class="$style.toolButton"
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
import { articleLink, localDateMinute } from "@/blog-plugin";
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
			.withCancelToken(session.abortSignal)
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
		localDateMinute,

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
	@mobile-margin: 1rem;

	width: 66vw;
	max-width: 1000px;
	margin: 0 auto;
	padding-top: 50px;

	@media screen and (max-width: @length-screen-wide) {
		width: 78vw;
	}

	@media screen and (max-width: @length-screen-pad) {
		width: 90vw;
	}

	@media screen and (max-width: @length-screen-mobile) {
		width: initial;
		padding: 30px @mobile-margin 0;

		/*
		 * 取消一些元素的左右边距，使其在手机屏下有更大的显示范围。
		 * 这些元素包括自带边距的比如代码块、无需边距的图片视频。
		 *
		 * 因为图片处于 <p> 内部无法与文字区分，所以只能用白名单模式，
		 * 给这些元素加上负边距扩大，而不能用黑名单去给要边距的缩小。
		 */
		:global(.center-wrapper), pre > code {
			border-radius: 0;
			margin-left: -@mobile-margin;
			margin-right: -@mobile-margin;
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

.content {
	font-size: initial;
}

.discussion {
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
			max-width: 1100px;
		}
	}
}

/*
 * 侧边按钮的位置如果贴右侧，则宽屏下会距离内容区太远，
 * 这里选用贴内容区，在 1200px 断点处还是会超出屏幕一点。
 */
.sideButtons {
	composes: vertical-btn-group from global;

	position: fixed;
	top: 61vh;
	right: 1rem;

	background-color: white;

	@media screen {
		@media (min-width: @length-screen-pad) {
			right: 3%;
		}
		@media (min-width: @length-screen-wide) {
			left: calc(50vw + 540px);
		}
	}
}

.toolButton {
	composes: outline primary from global;

	width: 55px;
	height: 55px;
	padding: 0;

	border-radius: 50%;
	font-size: 1.8rem;
}
</style>
