<template>
	<div>
		<div class="btn-group console-toolbar">
			<kx-button
				icon="fa fa-edit"
				class="primary"
				@click="newArticle">
				新文章
			</kx-button>
		</div>

		<div class="panel">
			<article-item
				v-for="item of list.items"
				:key="item.id"
				:value="item"
				class="segment"
			/>
			<span v-if="list.total === 0">没有找到文章,去写一篇吧~</span>
			<sk-fading-circle v-if="loading"/>
		</div>
	</div>
</template>

<script>
import api from "../../api";
import ArticleItem from "./ArticleItem";
import {errorMessage} from "../../utils";

export default {
	name: "ArticleConsole",
	components: {
		ArticleItem,
	},
	data: () => ({
		loading: true,
		list: [],
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
				deletion: "ALL",
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
