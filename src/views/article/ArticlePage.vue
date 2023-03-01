<template>
	<BannerPageLayout :banner='post.banner'>
		<PageMeta :title='post.title' :body-class='$style.container'/>

		<article :class='$style.article'>
			<header :class='$style.header'>
				<h1 :class='$style.title'>{{ post.title }}</h1>
				<p>
					<span>发布时间：</span>
					<RelativeTime :value='post.create'/>
				</p>
				<p>
					<span>最后更新：</span>
					<RelativeTime :value='post.update'/>
				</p>
			</header>

			<!--
			因为 Markdown 转换出的是 HTML，激活操作也是在 HTML 层，所以不需要 Vue 的 Hydrate。
			同时转换结果就是 innerHTML，直接就能从元素上读取，无需再次转换。

			这提供了一种新的思路，即首屏直接从 innerHTML 取结果，无需引入庞大的转换器代码；
			在后端仍需要转换（SSR 或 SSG），所以此处两个组件在前后端是不同的，
			但只要渲染出的 HTML 相同，就能通过 Hydrate 检查。
			-->
			<FinishedMDView
				v-if='serverGeneratedHTML'
				:class='$style.content'
				:html='serverGeneratedHTML'
				:data-article-id='post.id'
			/>
			<LazyMarkdownView
				v-else
				:value='post.content'
				:is-article='true'
				doc-id='h'
				:class='$style.content'
				:data-article-id='post.id'
			/>

			<footer :class='$style.copyright'>
				<a rel='license' href='https://creativecommons.org/licenses/by-sa/4.0/'>
					<img
						alt='知识共享许可协议'
						width='88'
						height='31'
						src='https://i.creativecommons.org/l/by-sa/4.0/88x31.png'
					/>
				</a>
				<br/>
				本作品采用
				<a rel='license' href='https://creativecommons.org/licenses/by-sa/4.0/' class='highlight'>
					知识共享署名-相同方式共享 4.0 国际许可协议</a>进行许可。
			</footer>
		</article>

		<DiscussionSection
			ref='discussion'
			:key='post.id'
			:object-id='post.id'
			:type='1'
			:class='$style.discussion'
		/>

		<aside
			v-if='$bp.isGreater("tablet")'
			:class='$style.sideButtons'
		>
			<KxButton
				type='outline'
				color='primary'
				:class='$style.toolButton'
				title='转到评论'
				@click='gotoDiscuss'
			>
				<ChatIcon/>
			</KxButton>
			<KxButton
				type='outline'
				color='primary'
				:class='$style.toolButton'
				title='回顶部'
				@click='gotoTop'
			>
				<ArrowTopIcon/>
			</KxButton>
		</aside>

		<HeadTags>
			<meta name='description' :content='post.summary'>
			<link v-if='post.prev' rel='prev' :title='post.prev.title' :href='articleLink(post.prev)'>
			<link v-if='post.next' rel='next' :title='post.next.title' :href='articleLink(post.next)'>

			<meta property='og:image' :content='`https://blog.kaciras.com${post.cover}`'>
			<meta property='og:image:width' content='400'/>
			<meta property='og:image:height' content='300'/>
			<meta property='og:title' :content='post.title'>
			<meta property='og:type' content='article'>
			<meta property='og:description' :content='post.summary'>
			<meta property='og:site_name' content='Kaciras Blog'>
			<meta property='og:url' :content='`https://blog.kaciras.com${articleLink(post)}`'>
		</HeadTags>
	</BannerPageLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PrefetchContext } from "@/prefetch";
import { usePrefetch } from "@/store";
import { articleLink } from "@/common";
import { prefetchMarkdownView } from "@/markdown";

function asyncData(session: PrefetchContext) {
	const { store, route, api, data } = session;
	const { id, urlTitle } = route.params;
	const { article } = usePrefetch(store).data;

	const idInt = parseInt(id as string);
	if (article?.id === idInt) {
		return; // 重定向来的，文章已经加载过了，这里假定 urlTitle 是正确的。
	}

	data.article = api.article.findById(idInt).then(v => {
		// 检查 URL 中的标题，不正确则重定向。
		if (urlTitle !== v.urlTitle) {
			session.redirect(301, articleLink(v));
		}
		return v;
	});

	data.markdownView = prefetchMarkdownView().then();
}

export default defineComponent({ asyncData });
</script>

<script setup lang="ts">
import { ref, ComponentPublicInstance, computed, useCssModule } from "vue";
import ChatIcon from "@material-design-icons/svg/outlined/forum.svg?sfc";
import ArrowTopIcon from "@material-design-icons/svg/outlined/rocket_launch.svg?sfc";
import { KxButton, RelativeTime } from "@kaciras-blog/uikit";
import { Article } from "@/api";
import BannerPageLayout from "@/components/BannerPageLayout.vue";
import PageMeta from "@/components/PageMeta";
import DiscussionSection from "@/components/discussion/DiscussionSection.vue";
import HeadTags from "@/components/HeadTags";
import { LazyMarkdownView } from "@/markdown";
import FinishedMDView from "@/markdown/FinishedMDView.vue";

const prefetch = usePrefetch();
const styles = useCssModule();

/*
 * TODO: 这里把预载状态复制到了本地，会丧失响应性，但如果用 computed 又存在
 *  下一个页面的数据覆盖导致一致性问题，在 Suspense 稳定之前我不想研究解决方案。
 */

// WebStorm 好像把 article 跟其它什么东西搞混了，所以改名叫 post。
const post = prefetch.data.article as Article;
const discussion = ref<ComponentPublicInstance>();

/**
 * 页面上已经存在的 Markdown HTML，如果当前不是文章页，或当前文章不是要渲染的则返回 null。
 * 1.706ms vs 0.112ms
 */
const serverGeneratedHTML = computed(() => {
	if (import.meta.env.SSR) {
		return null;
	}
	const markdownEl = document.querySelector("." + styles.content);
	if (!markdownEl) {
		return null;
	}
	const ssrId = Number(markdownEl.getAttribute("data-article-id"));
	return ssrId === post.id ? markdownEl.innerHTML : null;
});

function gotoTop() {
	document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
}

function gotoDiscuss() {
	discussion.value!.$el.scrollIntoView({ behavior: "smooth" });
}
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

	// 一行的长度过大会让阅读困难，太小又不利于媒体展示。根据研究英文在 50-80 个字母最佳。
	// https://ux.stackexchange.com/questions/108801/what-is-the-best-number-of-paragraph-width-for-readability
	//
	// 这篇 W3C 的指南推荐 CJK 使用 40 个字：
	// https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-visual-presentation.html
	//
	// 参考其他站点：
	// 批站专栏：		39 汉字，660 px。
	// 知乎专栏：		43 汉字，690 px。
	// dev.to：		80 字母，678 px。
	// css-tricks：	80 字母，700 px，媒体 950 px。
	//
	// 我自己的测试 1000px 太宽了，900 px（54 汉字）读起来也挺顺的，先用着试试，确实比指南和其它站宽了点。
	max-width: 900px;

	width: 66vw;
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

		// 取消一些元素的左右边距，使其在手机屏下有更大的显示范围。
		// 这些元素包括自带边距的比如代码块、无需边距的图片视频。
		//
		// 因为图片处于 <p> 内部无法与文字区分，所以只能用白名单模式，
		// 给这些元素加上负边距扩大，而不能用黑名单去给要边距的缩小。
		:global(.center-wrapper), :global(.hljs) {
			border-radius: 0;
			margin-left: -@mobile-margin;
			margin-right: -@mobile-margin;
		}
	}
}

.header {
	composes: segment from global;
	text-align: center;
}

.title {
	font-size: 2rem;
}

.content {
	font-size: initial;
}

.copyright {
	composes: panel from global;

	font-size: initial;
	background: #f7f7f7;
	text-align: center;
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

	@media screen {
		@media (min-width: @length-screen-pad) {
			right: 3%;
		}
		@media (min-width: @length-screen-wide) {
			left: calc(84vw + 40px);
		}
	}
}

.toolButton {
	width: 55px;
	height: 55px;
	padding: 0;
	background-color: white;

	border-radius: 50%;
	font-size: 1.8rem;
}
</style>
