<template>
	<div class='btn-group console-toolbar'>
		<KxButton
			class='primary'
			@click='newArticle'
		>
			<EditIcon class='prefix'/>
			新文章
		</KxButton>
		<KxButton
			color='dangerous'
			@click='deleteAll'
		>
			<TrashIcon class='prefix'/>
			全部删除
		</KxButton>
	</div>

	<ScrollPagingView
		v-model='draftList'
		:loader='loadPage'
		:page-size='20'
		:auto-load='true'
	>
		<template v-slot='{ items }'>
			<ol v-if='items.length' class='clean-list'>
				<DraftConsoleItem
					v-for='draft of items'
					:key='draft.id'
					class='segment'
					v-bind='draft'
					@removed='removeItem(draft)'
				/>
			</ol>
			<span v-else class='minor-text'>空空如也</span>
		</template>
	</ScrollPagingView>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { KxButton, MessageType, ScrollPagingView, useDialog } from "@kaciras-blog/uikit";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import TrashIcon from "bootstrap-icons/icons/trash.svg?sfc";
import api, { Draft } from "@/api";
import { deleteOn, errorMessage } from "@/utils";
import DraftConsoleItem from "./DraftConsoleItem.vue";
import { ListQueryView } from "@/api/core";

const dialog = useDialog();
const router = useRouter();

// TODO: 列表的空数据状态处理。
const DEFAULT_PAGE_DATA: ListQueryView<Draft> = { items: [], total: Infinity };

const draftList = ref(DEFAULT_PAGE_DATA);

function newArticle() {
	return api.draft.createNew()
		.then(id => router.push("/edit/" + id))
		.catch(e => dialog.alertError("创建失败", errorMessage(e)));
}

async function deleteAll() {
	const result = await dialog.alert({
		title: "删除所有草稿",
		content: "该操作不可撤销，是否继续？",
		type: MessageType.Warning,
		cancelable: true,
	});
	if (!result.isConfirm) {
		return;
	}
	api.draft.clear()
		.then(() => draftList.value = DEFAULT_PAGE_DATA)
		.catch(e => dialog.alertError("清空失败", errorMessage(e)));
}

function loadPage(start: number, count: number) {
	const userId = 2;
	return api.draft.getList({ userId, start, count });
}

function removeItem(item: Draft) {
	draftList.value.total -= 1;
	deleteOn(draftList.value.items, d => d === item);
}
</script>
