<template>
	<div class="btn-group console-toolbar">
		<KxButton
			@click="newArticle"
		>
			<EditIcon class="prefix"/>
			新文章
		</KxButton>
	</div>

	<ArticleItem
		v-for="article of list.items"
		:key="article.id"
		:value="article"
		class="segment"
	/>
	<span v-if="list.total === 0">
		没有找到文章,去写一篇吧~
	</span>
	<SkFadingCircle v-if="loading"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { KxButton, SkFadingCircle, useDialog } from "@kaciras-blog/uikit";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import api, { DeletionState } from "@/api";
import { errorMessage } from "@/utils";
import ArticleItem from "./ArticleItem.vue";

const dialog = useDialog();
const router = useRouter();

const list = ref([]);
const loading = ref(true);

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
		list.value = data;
	}).catch(e => {
		dialog.alertError("加载文章失败", errorMessage(e));
	}).finally(() => {
		loading.value = false;
	});
}

loadArticles();
</script>
