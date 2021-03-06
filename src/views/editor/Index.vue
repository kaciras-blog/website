<template>
	<markdown-editor :class="$style.editor" v-model="current.content">

		<template v-slot:tools-left="{ ctx }">
			<text-tools :ctx="ctx"/>
		</template>

		<template v-slot:tools-right="{ ctx }">
			<kx-button class="info" title="双列视图" icon="fas fa-columns" @click="ctx.viewMode = 0"/>
			<kx-button class="info" title="Markdown视图" icon="far fa-edit" @click="ctx.viewMode = 1"/>
			<kx-button class="info" title="Html视图" icon="fas fa-eye" @click="ctx.viewMode = 2"/>

			<kx-button class="primary" title="修改简介" icon="far fa-address-card" @click="showMetadataDialog"/>
			<kx-button class="primary" title="保存" icon="far fa-save" @click="manualSave"/>
			<kx-button class="primary" title="发布!" icon="far fa-paper-plane" @click="showPublishDialog"/>
		</template>

		<template v-slot:state-left>
			<span v-if="autoSaveError" :class="$style.error">
				自动保存出错
			</span>
			<span v-else-if="draft.updateTime">
				上次保存：{{draft.updateTime | localDateMinute}}
			</span>
		</template>

		<template v-slot:state-right="{ ctx }">
			<text-state-group :selection="ctx.selection" :content="ctx.content"/>
			<sync-scroll-toggle :ctx="ctx"/>
		</template>
	</markdown-editor>
</template>

<script>
import api from "@/api";
import MarkdownEditor from "@/markdown/MarkdownEditor";
import TextTools from "@/markdown/TextTools";
import TextStateGroup from "@/markdown/TextStateGroup";
import { articleLink } from "@/blog-plugin";
import { errorMessage } from "@/utils";
import PublishDialog from "./PublishDialog";
import MetadataDialog from "./MetadataDialog";
import SyncScrollToggle from "@/markdown/SyncScrollToggle";

export default {
	name: "EditPage",
	components: {
		SyncScrollToggle,
		TextStateGroup,
		TextTools,
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
	methods: {
		/**
		 * 监视文本的改变，当改变时开始计时5分钟，到点自动保存
		 */
		watchForAutoSave() {
			const callback = () => {
				unwatch();
				this.$_autoSaveTimer = setTimeout(this.autoSave, 5 * 60 * 1000);
			};
			const unwatch = this.$watch("current", callback, { deep: true });
		},

		async autoSave() {
			const { draft, current } = this;
			this.watchForAutoSave();

			try {
				await api.draft.save(draft.id, current.saveCount, current);
				draft.updateTime = new Date();
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
				this.autoSaveError = null;

				this.$dialog.alertSuccess("保存成功");

				// 刷新自动保存的计时
				clearTimeout(this.$_autoSaveTimer);
				this.watchForAutoSave();
			} catch (e) {
				this.$dialog.alertError("保存失败，请手动备份", errorMessage(e));
			}
		},

		async showMetadataDialog() {
			const result = await this.$dialog.show(MetadataDialog, this.current).confirmPromise;
			Object.assign(this.current, result);
		},

		async showPublishDialog() {
			const article = await this.$dialog.show(PublishDialog, this.$data).confirmPromise;
			this.changes = false;
			return this.$router.push(articleLink(article));
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
		this.$watch("current", () => this.changes = true, { deep: true });
		this.watchForAutoSave();

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

.error {
	color: #ff4f4f;
	font-weight: 600;
}
</style>
