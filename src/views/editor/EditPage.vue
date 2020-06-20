<template>
	<markdown-editor :class="$style.editor" v-model="current.content"></markdown-editor>
</template>

<script>
import { VueMultiWatcher } from "@kaciras-blog/uikit";
import api from "@/api";
import { errorMessage } from "@/utils";
import MarkdownEditor from "@/markdown/MarkdownEditor";
import PublishDialog from "./PublishDialog";
import MetadataDialog from "./MetadataDialog";

export default {
	name: "EditPage",
	components: {
		MarkdownEditor,
	},
	props: {
		draftId: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		// Vue2的TS支持不好，只能写上以便IDE提示，下面的current也是
		draft: {
			id: null,
			articleId: null,
			userId: 0,
			updateTime: null,
		},

		current: {
			title: "",
			cover: "",
			keywords: "",
			summary: "",
			content: "",
			saveCount: 0,
		},

		/** 是否有在未保存的改动 */
		changes: false,

		autoSaveError: null,
	}),
	watch: {
		metadata() { this.changes = true; },
		content() { this.changes = true; },
	},
	methods: {
		async showMetadataDialog() {
			const result = await this.$dialog.show(MetadataDialog, this.current).confirmPromise;
			Object.assign(this.current, result);
		},

		/** 监视文本的改变，当改变时开始计时5分钟，到点自动保存 */
		watchChanges() {
			const callback = () => {
				this.$_autoSaveTimer = setTimeout(this.autoSave, 5 * 60 * 1000);
			};
			new VueMultiWatcher(this, ["metadata", "content"], callback, { once: true });
		},

		async autoSave() {
			const { draft, current } = this;
			try {
				await api.draft.save(draft.id, current.saveCount, current);
				draft.updateTime = new Date();

				this.watchChanges();
				this.changes = false;
				this.autoSaveError = null;
			} catch (e) {
				this.autoSaveError = e;
			}
		},

		async manualSave() {
			const { draft, current } = this;
			try {
				await api.draft.saveNewHistory(draft.id, current);
				draft.updateTime = new Date();
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
			const { draft } = this;
			this.current = await api.draft.getHistory(draft.id, saveCount);
			draft.updateTime = this.current.time;
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
		this.draft = await api.draft.get(parseInt(this.draftId));
		const { lastSaveCount, articleId } = this.draft;

		await this.loadHistory(lastSaveCount);

		this.changes = false;
		this.watchChanges();

		if (!articleId && this.current.saveCount === 0) {
			await this.showMetadataDialog();
		}
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
