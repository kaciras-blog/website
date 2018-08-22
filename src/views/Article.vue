<template>
<main id="app">
	<div class="container">
		<article-view :article="article"></article-view>
		<discuss-panel></discuss-panel>
	</div>
	<div class="side-buttons">
		<button id="gotodiscuss" class="square border center-all" title="转到评论区"><i class="far fa-comments"></i>
		</button>
		<button id="gototop"
				class="square border center-all"
				title="回顶部"
				@click="gototop()">
			<i class="fas fa-chevron-up"></i>
		</button>
	</div>
</main>
</template>

<script>
import DiscussPanel from "../components/DiscussPanel";
import ArticleView from "../components/ArticleView";
import api from "../apis";
import {scrollToElementStart, sleep} from "../utils";
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
			article: null,
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
	beforeRouteUpdate(to, from, next) {
		sleep(3000).then(() => api.article.get(to.params.id)
			.then(article => next(vm => {
				vm.article = article;
				this.$dialog.close();
			}))
			.catch(() => next("/error")));
	},
};
</script>

<style scoped>

</style>
