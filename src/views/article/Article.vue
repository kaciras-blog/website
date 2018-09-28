<template>
	<page-layout
		view-id="article-page"
		:style="navStyle"
		:banner="true"
		:footer="true">

		<article-view v-bind="article"/>
		<discuss-panel :article-id="article.id" ref="discssPanel"/>

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
import { scrollToElementStart, escapeHtml } from "../../utils";
import api from "../../apis";
import $ from "jquery";
import { mapState } from "vuex";


const storeModule = {
	namespaced: true,
	state: () => ({
		item: {},
	}),
	actions: {
		fetchItem({ commit }, id) {
			// `store.dispatch()` 会返回 Promise，以便我们能够知道数据在何时更新
			return api.article.get(id).then(item => commit("setItem", item));
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
	metadata() {
		const { title, keywords, summary, prev, next } = this.article;
		let headers = `
				<meta name="description" content="${escapeHtml(summary)}">
				<meta name="keywords" content="${escapeHtml(keywords.join(","))}">`;
		if (prev) {
			headers += `<link rel="prev" title="${prev.title}" href="/article/${prev.id}">`;
		}
		if (next) {
			headers += `<link rel="next" title="${next.title}" href="/article/${next.id}">`;
		}
		return { title: title + " - Kaciras的博客", meta: headers };
	},
	asyncData({ store, route }) {
		store.registerModule("article", storeModule);
		return store.dispatch("article/fetchItem", route.params.id);
	},
	prefetch: true, // 在客户端是否预加载数据
	computed: {
		navStyle () {
			return {"--background": `url(${this.article.banner || require("../../assets/index-banner.jpg")})` };
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
@import "../../css/ToBeImpoert";

#article-page {

	& > article {
		padding: 0 .5rem;
		margin: 0 auto;

		@media screen {
			@media (min-width: @length-screen-mobile) {
				max-width: 90%;
			}
			@media (min-width: @length-screen-pad) {
				max-width: 80%;
			}
			@media (min-width: @length-screen-wide) {
				max-width: 70%;
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
		width: 2.5rem;
		height: 2.5rem;

		font-size: 1.5rem;
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
