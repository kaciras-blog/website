<template>
	<kx-markdown-edit-window :class="$style.editor" :text.sync="content"/>
</template>

<script>
import api from "@/api";
import { VueMultiWatcher } from "@kaciras-blog/uikit";
import { assignUpdate, errorMessage } from "@/utils";
import KxMarkdownEditWindow from "@/markdown/EditWindow";
import PublishDialog from "./PublishDialog";
import MetadataDialog from "./MetadataDialog";

function convertToTransfer(data) {
	return Object.assign({
		id: data.archive.id,
		articleId: data.archive.articleId,
		content: data.content,
	}, data.metadata);
}

export default {
	name: "EditPage",
	components: {
		KxMarkdownEditWindow,
	},
	data: () => ({
		archive: {
			id: null,
			articleId: null,
			saveCount: 0,
			saveTime: null,
		},
		metadata: {
			title: "",
			cover: "",
			keywords: "",
			summary: "",
		},
		content: "",

		/** 是否有在未保存的改动 */
		changes: false,

		autoSaveError: null,
	}),
	watch: {
		metadata() { this.changes = true; },
		content() { this.changes = true; },
	},
	methods: {
		metadataDialog() {
			this.$dialog.show(MetadataDialog, { metadata: this.metadata })
				.onConfirm(data => this.metadata = data);
		},

		/** 监视文本的改变，当改变时开始计时5分钟，到点自动保存 */
		watchChanges() {
			const callback = () => {
				this.$_autoSaveTimer = setTimeout(this.autoSave, 5 * 60 * 1000);
			};
			new VueMultiWatcher(this, ["metadata", "content"], callback, { once: true });
		},

		async autoSave() {
			const { archive } = this;
			try {
				const data = convertToTransfer(this.$data);
				await api.draft.save(archive.id, archive.saveCount, data);

				archive.saveTime = new Date();
				this.watchChanges();
				this.changes = false;
				this.autoSaveError = null;
			} catch (e) {
				this.$dialog.alertError("保存失败", errorMessage(e));
				this.autoSaveError = e;
			}
		},

		async manualSave() {
			const { archive } = this;
			try {
				await api.draft.saveNewHistory(archive.id, convertToTransfer(this.$data));
				archive.saveTime = new Date();
				this.changes = false;
				this.$dialog.alertSuccess("保存成功");
			} catch (e) {
				this.$dialog.alertError("保存失败，请手动备份", errorMessage(e));
			}
		},

		async publish() {
			const article = await this.$dialog.show(PublishDialog, this.$data).confirmPromise;
			this.changes = false;
			return this.$router.push(`/article/${article}`);
		},

		async loadHistory(saveCount) {
			const { archive } = this;
			const history = await api.draft.getHistory(archive.id, saveCount);

			assignUpdate(history, this.metadata);
			archive.saveTime = history.time;
			archive.saveCount = history.saveCount;
			this.content = history.content;
		},

		onPageExit(event) {
			if (this.changes) {
				return event.returnValue = "Sure?";
			}
		},
	},
	beforeRouteLeave(to, from, next) {
		if (this.changes) {
			const exit = confirm("有未保存的改动，是否退出？");
			if (exit === false) {
				return next(false);
			}
		}
		return next();
	},
	async beforeMount() {
		const id = this.$route.params["id"];
		if (!id) {
			return; // 必须先创建草稿
		}
		const draft = await api.draft.get(id);
		assignUpdate(draft, this.archive);

		await this.loadHistory(draft.lastSaveCount);

		if (!draft.articleId && draft.saveCount === 0) {
			await this.metadataDialog();
		}

		this.changes = false;
		this.watchChanges();
	},
	mounted() {
		window.addEventListener("beforeunload", this.onPageExit);
	},
	beforeDestroy() {
		clearTimeout(this.$_autoSaveTimer);
		window.removeEventListener("beforeunload", this.onPageExit);
	},
};
</script>

<style module lang="less">
.editor {
	height: 100vh;
}
</style>
