<template>
	<div class="btn-group console-toolbar">
		<kx-button
			@click="newArticle"
		>
			<EditIcon class="prefix"/>
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
		<span v-if="list.total === 0">
			没有找到文章,去写一篇吧~
		</span>
		<sk-fading-circle v-if="loading"/>
	</div>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useRouter } from "vue-router";
import { KxButton, SkFadingCircle, useDialog } from "@kaciras-blog/uikit";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import api, { DeletionState } from "@/api";
import { errorMessage } from "@/utils";
import ArticleItem from "./ArticleItem.vue";

const dialog = useDialog();
const router = useRouter();

const list = shallowRef([]);
const loading = shallowRef(true);

async function newArticle() {
	try {
		await router.push("/edit/" + await api.draft.createNew());
	} catch (e) {
		dialog.alertError("创建失败", errorMessage(e));
	}
}

function loadArticles() {
	loading.value = true;

	return api.article.getList({
		start: 0,
		count: 99999, // TODO: 文章多了就做下分页
		deletion: DeletionState.None,
	}).then(data => {
		loading.value = false;
		list.value = data;
	}).catch(e => {
		dialog.alertError("加载文章失败", errorMessage(e));
	});
}

loadArticles();
</script>
