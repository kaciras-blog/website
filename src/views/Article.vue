<template>
	<page-layout view-id="article-page" :banner="true" :footer="true">

		<article-view v-bind="article"/>
		<discuss-panel :article-id="article.id" ref="discss-panel"/>

		<div class="side-buttons vertical button-group">
			<button class="outline"
					title="转到评论区"
					@click="gotodiscuss">
				<i class="far fa-comments"></i>
			</button>
			<button class="outline"
					ref="gotoTop"
					title="回顶部"
					@click="gotoTop">
				<i class="fas fa-chevron-up"></i>
			</button>
		</div>
	</page-layout>
</template>

<script>
import DiscussPanel from "../components/DiscussPanel";
import ArticleView from "../components/ArticleView";
import TitleMixin from "../title-mixin";
import {scrollToElementStart, escapeHtml} from "../utils";
import api from "../apis";
import $ from "jquery";

function scrollFadeIn(button, minHeight) {
	button = $(button);
	minHeight = minHeight || 400;
	return function () {
		if ($(window).scrollTop() > minHeight) {
			button.fadeIn(300);
			document.querySelector(".side-buttons").classList.add("button-group");
		} else {
			button.fadeOut(300);
			document.querySelector(".side-buttons").classList.remove("button-group");
		}
	};
}

const articleStoreModule = {
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
		const {title, keywords, summary} = this.article;
		return {
			title: title + " - Kaciras的博客",
			meta: `
				<meta name="description" content="${escapeHtml(summary)}">
				<meta name="keywords" content="${escapeHtml(keywords.join(","))}">
			`,
		};
	},
	asyncData({store, route}) {
		// 触发 action 后，会返回 Promise
		store.registerModule("article", articleStoreModule);
		return store.dispatch("article/fetchItem", route.params.id);
	},
	prefetch: true, // 在客户端是否预加载数据
	computed: {
		article() {
			return this.$store.state.article.item;
		},
	},
	methods: {
		gotodiscuss() {
			scrollToElementStart(this.$refs["discss-panel"].$el);
		},
		gotoTop() {
			$("html,body").animate({ scrollTop: 0 }, 300);
		},
	},
	mounted() {
		this.$refs.gotoTop.style.display = "none";
		this.scrollHandler = scrollFadeIn(this.$refs.gotoTop, 600);
		$(window).on("scroll", this.scrollHandler);
	},
	destroyed() {
		this.$store.unregisterModule("article");
		$(window).off("scroll", this.scrollHandler);
	},
};
</script>

<style lang="less">
@import "../css/ToBeImpoert";

#article-page {

	& > article {
		margin: 0 auto;

		@media screen {
			@media (min-width: @length-screen-mobile) {  max-width: 90%;  }
			@media (min-width: @length-screen-pad) {  max-width: 85%;  }
			@media (min-width: @length-screen-wide) {  max-width: 75%;  }
		}
	}

	& > .discuss{
		margin-left: auto;
		margin-right: auto;

		@media screen {
			@media (min-width: @length-screen-pad) {  max-width: 85%;  }
			@media (min-width: @length-screen-wide) {  max-width: 75%;  }
		}
	}
}

.side-buttons {
	display: flex;
	flex-direction: column;
	position: fixed;

	background-color: white;
	top: 72%;
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

	& > button {
		margin-top: -1px;
		padding: 0;
		font-size: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;

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
