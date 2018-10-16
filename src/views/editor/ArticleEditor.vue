<template>
	<main :class="$style.container">
		<div class="kx-markdown-toolbar" role="toolbar">
			<div>
				<kx-markdown-basic-toolbar :text.sync="content" :selection.sync="selection"/>
				<kx-button class="minor" title="插入图片" icon="far fa-file-image" @click="addImage"/>
			</div>
			<div>
				<view-mode-toolbar :view-mode.sync="viewMode"/>
				<kx-button class="primary" title="修改简介" icon="far fa-address-card" @click="metadataDialog"/>
				<kx-button class="primary" title="保存" icon="far fa-save" @click="saveManually"/>
				<kx-button class="primary" title="发布!" icon="far fa-paper-plane" @click="publish"/>
			</div>
		</div>

		<kx-markdown-edit-window
			:text.sync="content"
			:selection.sync="selection"
			:view-mode="viewMode"/>

		<div class="kx-markdown-statebar">
			<div>
				<span v-if="autoSaveError" :class="$style.errMsg">自动保存出错！</span>
				<span v-else>上次保存：{{archive.time}}</span>
			</div>
			<div>
				<text-state-group :text="content" :selection="selection"/>
			</div>
		</div>
	</main>
</template>

<script>
import KxMarkdownEditWindow from "../../markdown/EditWindow";
import KxMarkdownBasicToolbar from "../../markdown/BasicToolbar";
import KxMarkdownStatebar from "../../markdown/TextStateGroup";
import TextStateGroup from "../../markdown/TextStateGroup";
import KxMarkdownConfigToolbar from "../../markdown/ConfigToolbar";
import ViewModeToolbar from "../../markdown/ViewModeToolbar";

import PublishDialog from "./PublishDialog";
import MetadataDialog from "./MetadataDialog";
import api from "../../api";
import { assignUpdate } from "../../utils";


class VueMultiWatcher {

	constructor(vm, paths, callback, options) {
		this.unwatchs = paths.map(path => vm.$watch(path, callback, options));
	}

	unwatch() {
		this.unwatchs.forEach(unwatch => unwatch());
	}
}

function convertToTransfer(data) {
	return Object.assign({
		id: data.archive.id,
		articleId: data.archive.articleId,
		content: data.content,
	}, data.metadata);
}

function convertToFront(json, data) {
	assignUpdate(json, data);
	assignUpdate(json, data.archive);
	assignUpdate(json, data.metadata);
}

export default {
	name: "ArticleEditor",
	components: {
		ViewModeToolbar,
		KxMarkdownConfigToolbar,
		KxMarkdownStatebar,
		KxMarkdownBasicToolbar,
		KxMarkdownEditWindow,
		TextStateGroup,
	},
	data: () => ({
		archive: {
			id: null,
			articleId: null,
			saveCount: 0,
			time: null,
		},
		metadata: {
			title: "",
			cover: "",
			keywords: "",
			summary: "",
		},
		content: "",
		selection: [0, 0],
		viewMode: 0,
		autoSaveError: false,
	}),
	methods: {
		async addImage() {
			const res = await api.misc.uploadImageFile();
			const [selStart, selEnd] = this.selection;
			const p = selStart + 2;
			const v = this.content;

			this.content = v.substring(0, selEnd) + `![](${res})` + v.substring(selEnd);
			this.selection = [p, p];
		},
		async metadataDialog() {
			const res = await this.$dialog.show(MetadataDialog, { metadata: this.metadata });
			if (res)
				this.metadata = res;
		},
		async saveManually() {
			const { archive } = this;
			try {
				await api.draft.saveNewHistory(archive.id, archive.saveCount, convertToTransfer(this.$data));
				archive.time = new Date();
				this.$dialog.messageBox("保存草稿", "保存成功");
			} catch (e) {
				this.$dialog.messageBox("保存草稿", "保存失败，请手动备份", "error");
			}
		},
		watchChanges() {
			const watcher = new VueMultiWatcher(this, [
				"metadata", "content",
			], () => {
				setTimeout(this.autoSave, 10 * 1000);
				watcher.unwatch();
			});
		},
		autoSave() {
			const { archive } = this;
			api.draft.save(archive.id, archive.saveCount, convertToTransfer(this.$data))
				.then(() => {
					archive.time = new Date();
					this.autoSaveError = false;
					this.watchChanges();
				})
				.catch(() => this.autoSaveError = true);
		},
		publish() {
			this.$dialog.show(PublishDialog, this.$data);
		},
	},
	async beforeMount() {
		const id = this.$route.params["id"];
		if (!id) {
			return; // 必须先创建草稿
		}
		const draft = await api.draft.get(id);
		convertToFront(draft, this.$data);

		if (!draft.articleId && draft.saveCount === 0) {
			await this.metadataDialog();
		}
		this.watchChanges();
	},
};
</script>

<style module lang="less">
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.mainWindow {
	height: calc(100% - 48px - .8rem);
}

.errMsg {
	color: #ff6b6b;
	font-weight: 600;
}
</style>
