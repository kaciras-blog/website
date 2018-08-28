<template>
<framework :banner="true">
	<main id="article-page">
		<div class="container">
			<article-view v-bind="article"></article-view>
			<discuss-panel></discuss-panel>
		</div>
		<div class="side-buttons">
			<button id="gotodiscuss" class="center-all" title="转到评论区">
				<i class="far fa-comments"></i>
			</button>
			<button id="gototop" class="square border center-all" title="回顶部" @click="gototop()">
				<i class="fas fa-chevron-up"></i>
			</button>
		</div>
	</main>
</framework>
</template>

<script>
import DiscussPanel from "../components/DiscussPanel";
import ArticleView from "../components/ArticleView";
import api from "../apis";
import {scrollToElementStart} from "../utils";
import $ from "jquery";

function gotoTop(button, minHeight, speed) {
	button.css("display", "none");
	$(button).click(function () {
		$('html,body').animate({scrollTop: 0}, speed);
	});
	minHeight = minHeight ? minHeight : 400;
	$(window).scroll(function () {
		if ($(window).scrollTop() > minHeight) {
			button.fadeIn(300);
		} else {
			button.fadeOut(300);
		}
	});
}

export default {
	name: "Article",
	components: {
		DiscussPanel,
		ArticleView,
	},
	data() {
		return {
			article: {},
		};
	},
	methods: {
		gototop() {
			scrollToElementStart("#discuss");
		},
	},
	mounted() {
		gotoTop($('#gototop'), 600, 300);
	},
	created() {
		api.article.get(this.$route.params.id).then(article => this.article = article);
	},
};
</script>

<style lang="less">
@import "../css/ToBeImpoert";

#article-page {
	margin: 0 auto;

	@media screen {
		@media (min-width: @length-screen-mobile) {
			max-width: 90%;
		}
		@media (min-width: @length-screen-pad) {
			max-width: 85%;
		}
		@media (min-width: @length-screen-wide) {
			max-width: 75%;
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

	& > button{
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
