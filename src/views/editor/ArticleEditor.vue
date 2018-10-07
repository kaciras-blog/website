<template>
	<div :class="$style.container">
		<div class="kx-markdown-toolbar">
			<kx-markdown-basic-toolbar
				:text.sync="content"
				:selection.sync="selection"/>
			<div>
				<kx-button class="icon green" title="双列视图" @click="viewModel = 0">
					<i class="fas fa-columns"></i>
				</kx-button>
				<kx-button class="icon green" title="Markdown视图" @click="viewModel = 1">
					<i class="far fa-edit"></i>
				</kx-button>
				<kx-button class="icon green" title="Html视图" @click="viewModel = 2">
					<i class="fas fa-eye"></i>
				</kx-button>
				<kx-button class="primary icon" title="编辑器设置" @click="showConfigDialog">
					<i class="fas fa-cog"></i>
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

function convertToFront(json, data) {
	assignUpdate(json, data);
	assignUpdate(json, data.archive);
	assignUpdate(json, data.metadata);
}

export default {
	name: "ArticleEditorII",
	components: { KxMarkdownConfigToolbar, KxMarkdownStatebar, KxMarkdownBasicToolbar, KxMarkdownEditWindow },
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
		showConfigDialog() {

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
