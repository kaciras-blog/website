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
			<kx-button
				class="dangerous"
				icon="far fa-trash-alt"
				@click="deleteAll"
			>
				全部删除
			</kx-button>
		</div>

		<scroll-paging-view
			v-model="draftList"
			:loader="loadPage"
			class="panel"
			:page-size="20"
			:auto-load="true"
		>
			<template v-slot="{ items }">
				<ol v-if="items.length" class="clean-list">
					<draft-console-item
						v-for="draft of items"
						:key="draft.id"
						class="segment"
						:value="draft"
						@removed="removeItem(draft.id)"
					/>
				</ol>
				<span v-else class="minor-text">空空如也</span>
			</template>
		</scroll-paging-view>
	</div>
</template>

<script setup>
import { shallowRef } from "vue";
import { MessageType, useDialog } from "@kaciras-blog/uikit";
import api from "@/api";
import { deleteOn, errorMessage } from "@/utils";
import DraftConsoleItem from "./DraftConsoleItem.vue";
import { useRouter } from "vue-router";

const dialog = useDialog();
const router = useRouter();

const draftList = shallowRef();
const showHistory = shallowRef();

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
		showCancelButton: true,
	});
	if (!result.isConfirm) {
		return;
	}
	api.draft.clear()
		.then(() => draftList.value = null)
		.catch(e => dialog.alertError("清空失败", errorMessage(e)));
}

function loadPage(start, count) {
	const userId = 2;
	return api.draft.getList({ userId, start, count });
}

function removeItem(id) {
	deleteOn(draftList.value.items, d => d.id === id);
}
</script>
