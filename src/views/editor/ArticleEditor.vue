<template>
	<div :class="$style.container">
		<div class="kx-markdown-toolbar">
			<div>
				<kx-markdown-basic-toolbar :text.sync="content" :selection.sync="selection"/>
				<kx-button class="minor" title="插入图片" icon="far fa-file-image" @click="addImage"/>
			</div>
			<div>
				<view-mode-toolbar :view-mode.sync="viewMode"/>
				<kx-button class="primary" title="修改简介" icon="far fa-address-card" @click="metadataDialog"/>
				<kx-button class="primary" title="保存" icon="far fa-save" @click="save(true)"/>
				<kx-button class="primary" title="发布!" icon="far fa-paper-plane" @click="publish"/>
			</div>
		</div>

		<kx-markdown-edit-window
			:text.sync="content"
			:selection.sync="selection"
			:view-mode="viewMode"/>

		<div class="kx-markdown-statebar">
			<div>

			</div>
			<div>
				<text-state-group :text="content" :selection="selection"/>
			</div>
		</div>
	</div>
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
			url: null,
			saveCount: 0,
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
		save(manually) {
			const promise = api.draft.save(this.archive.id, convertToTransfer(this.$data));
			if (manually) {
				promise.then(() => this.$dialog.messageBox("保存草稿", "保存成功"))
					.catch(() => this.$dialog.messageBox("保存草稿", "保存失败，请手动备份", "error"));
			}
		},
		publish() {
			this.$dialog.show(PublishDialog, this.$data);
		},
	},
	created() {
		const draftId = this.$route.params.id;
		if (!draftId) {
			return; // 必须先创建草稿
		}
		api.draft.get(draftId).then(json => {
			if (!json.articleId && json.saveCount === 0) {
				this.metadataDialog();
			}
			convertToFront(json, this.$data);
		});
	},
};
</script>

<style module lang="less">
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.menu {
	display: flex;
	/*justify-content: space-around;*/

	& > button {
		flex: 1 1 0;
	}
}

.mainWindow {
	height: calc(100% - 48px - .8rem);
}
</style>
