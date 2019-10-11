<template>
	<div>
		<div class="btn-group console-toolbar">
			<kx-button
				icon="fa fa-edit"
				class="primary"
				@click="newArticle"
			>
				新文章
			</kx-button>
		</div>

		<div class="panel">
			<article-item
				v-for="article of list.items"
				:key="article.id"
				:value="article"
				class="segment"
			/>
			<span v-if="list.total === 0">没有找到文章,去写一篇吧~</span>
			<sk-fading-circle v-if="loading"/>
		</div>
	</div>
</template>

<script>
import api, { DeletionState } from "@/api";
import { errorMessage } from "@/utils";
import ArticleItem from "./ArticleItem";

export default {
	name: "ArticleConsole",
	components: {
		ArticleItem,
	},
	data: () => ({
		list: [],
		loading: true,
	}),
	methods: {
		newArticle() {
			api.draft.createNew()
				.then(id => this.$router.push("/edit/" + id))
				.catch(e => this.$dialog.alertError("创建失败", errorMessage(e)));
		},
		loadArticles() {
			this.loading = true;

			api.article.getList({
				start: 0,
				deletion: DeletionState.ALL,
			}).then(data => {
				this.loading = false;
				this.list = data;
			}).catch(e => {
				this.$dialog.alertError("加载文章失败", errorMessage(e));
			});
		},
	},
	beforeMount() {
		this.loadArticles();
	},
};
</script>
