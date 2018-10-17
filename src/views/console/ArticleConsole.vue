<template>
	<main>
		<div class="toolbar btn-group">
			<kx-button
				class="primary"
				icon="fa fa-edit"
				@click="newArticle">
				新文章
			</kx-button>
		</div>

		<div class="panel">
			<article-console-item
				v-for="item of articles"
				:key="item.id"
				:value="item"
				class="segment"/>

			<span v-if="allLoaded && !articles.length">没有找到文章,去写一篇吧~</span>
			<sk-fading-circle v-if="loading"/>
		</div>
	</main>
</template>

<script>
import api from "../../api";
import ArticleConsoleItem from "./ArticleConsoleItem";

export default {
	name: "ArticleConsole",
	components: { ArticleConsoleItem },
	data () {
		return {
			loading: true,
			allLoaded: false,
			articles: [],
		};
	},
	methods: {
		newArticle () {
			api.draft.createNew()
				.then(id => this.$router.push("/edit/" + id))
				.catch(err => console.log(err));
		},
		loadArticles () {
			this.loading = true;
			const len = this.articles.length;

			api.article.getList(0, len === 0 ? 0 : this.articles[len - 1]["id"], 10, "ALL")
				.then(r => {
					this.articles = r;
					this.allLoaded = r.length === 0;
					this.loading = false;
				})
				.catch(err => this.$dialog.messageBox("加载文章失败", "原因：" + err, "error"));
		},
	},
	created () {
		this.loadArticles();
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImport";

.toolbar {
	margin-bottom: 1rem;
}
</style>
