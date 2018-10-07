<template>
	<div :class="$style.container">
		<div class="kx-markdown-toolbar">
			<kx-markdown-basic-toolbar
				:text.sync="content"
				:selection.sync="selection"/>

			<div>
				<view-mode-toolbar :view-mode.sync="viewMode"/>

				<kx-button class="primary icon" title="修改简介" @click="metadataDialog">
					<i class="far fa-address-card"></i>
				</kx-button>
				<kx-button class="primary icon" title="保存" @click="save(true)">
					<i class="far fa-save"></i>
				</kx-button>
				<kx-button class="primary icon" title="发布!" @click="publish">
					<i class="far fa-paper-plane"></i>
				</kx-button>
			</div>
		</div>

		<kx-markdown-edit-window
			:text.sync="content"
			:selection.sync="selection"
			:view-mode="viewMode"/>

		<div class="kx-markdown-statebar">
			<div class="kx-markdown-statebar-left">{{selection[0] + " - " + selection[1]}}</div>
			<div class="kx-markdown-statebar-right">
				<slot name="statebar-right"/>
			</div>
		</div>
	</div>
</template>

<script>
import KxMarkdownEditWindow from "../../markdown/EditWindow";
import KxMarkdownBasicToolbar from "../../markdown/BasicToolbar";
import api from "../../api";
import { assignUpdate } from "../../utils";
import KxMarkdownStatebar from "../../markdown/Statebar";
import KxMarkdownConfigToolbar from "../../markdown/ConfigToolbar";
import ViewModeToolbar from "../../markdown/ViewModeToolbar";
import PublishDialog from "./PublishDialog";
import MetadataDialog from "./MetadataDialog.vue";


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
	name: "ArticleEditorII",
	components: { ViewModeToolbar, KxMarkdownConfigToolbar, KxMarkdownStatebar, KxMarkdownBasicToolbar, KxMarkdownEditWindow },
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
		async metadataDialog() {
			const res = await this.$dialog.show(MetadataDialog, { metadata: this.metadata });
			if (res)
				this.metadata = res;
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
