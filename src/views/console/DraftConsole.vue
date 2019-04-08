<template>
	<main>
		<div class="btn-group" :class="$style.toolbar">

			<kx-button
				class="dangerous"
				icon="far fa-trash-alt"
				@click="deleteAll">
				全部删除
			</kx-button>
		</div>

		<div class="panel">
			<draft-console-item
				v-for="draft in drafts"
				:key="draft.id"
				class="segment"
				:value="draft"
				@removed="removeItem(draft.id)"/>

			<span v-if="!loading && drafts.length===0" class="minor-text">空空如也</span>

			<sk-fading-circle v-if="loading"/>
		</div>
	</main>
</template>

<script>
import api from "../../api";
import DraftConsoleItem from "./DraftConsoleItem";
import { deleteOn } from "../../utils";
import { MessageBoxType } from "kx-ui/src/dialog/index";

export default {
	name: "DraftConsole",
	components: { DraftConsoleItem },
	data:() => ({
		drafts: [],
		showHistory: null,
		allLoaded: false,
		last: 0,
		loading: true,
	}),
	methods: {
		deleteAll () {
			this.$dialog.messageBox({
				title: "警告",
				content: "该操作不可撤销，是否继续？",
				type: MessageBoxType.Warning,
				cancelable: true,
			}).onComfirm(() => {
				api.draft.clear().then(() => {
					this.drafts.splice(0, this.drafts.length);
					this.last = 0;
				}).catch(() => alert("清空失败!"));
			});
		},
		async loadDrafts () {
			if (this.allLoaded) {
				return;
			}
			this.loading = true;

			try {
				const list = await api.draft.getList(1, 0, 20);
				if (list.length === 0) {
					this.allLoaded = true;
				} else {
					list.forEach(v => this.drafts.push(v));
					this.last = list[list.length - 1]["id"];
				}
			} catch (e) {
				alert("加载草稿失败!");
			}
			this.loading = false;
		},
		removeItem (id) {
			deleteOn(this.drafts, d => d.id === id);
		},
	},
	beforeMount () {
		this.loadDrafts();
	},
};
</script>

<style module lang="less">
.toolbar {
	margin-bottom: 1rem;
}
</style>
