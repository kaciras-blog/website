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
						v-for="draft in items"
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

<script>
import { MessageBoxType } from "@kaciras-blog/uikit/src/dialog/index";
import api from "@/api";
import { deleteOn, errorMessage } from "@/utils";
import DraftConsoleItem from "./DraftConsoleItem";

export default {
	name: "DraftConsole",
	components: {
		DraftConsoleItem,
	},
	data: () => ({
		draftList: null,
		showHistory: null,
	}),
	methods: {
		newArticle() {
			return api.draft.createNew()
				.then(id => this.$router.push("/edit/" + id))
				.catch(e => this.$dialog.alertError("创建失败", errorMessage(e)));
		},
		async deleteAll() {
			const result = await this.$dialog.alert({
				title: "删除所有草稿",
				content: "该操作不可撤销，是否继续？",
				type: MessageBoxType.Warning,
				showCancelButton: true,
			});
			if (!result.isConfirm) {
				return;
			}
			api.draft.clear()
				.then(() => this.draftList = null)
				.catch(e => this.$dialog.alertError("清空失败", errorMessage(e)));
		},
		loadPage(start, count) {
			const userId = this.$store.state.user.id;
			return api.draft.getList({ userId, start, count });
		},
		removeItem(id) {
			deleteOn(this.draftList.items, d => d.id === id);
		},
	},
};
</script>
