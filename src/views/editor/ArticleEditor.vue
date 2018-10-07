<template>

		<kx-markdown-edit-window
			:class="$style.container"
			:viewMode="viewMode"
			:text.sync="content"
			:selection.sync="selection">

			<template slot="toolbar-right">
				<kx-button class="icon green" title="双列视图" @click="viewModel = 0">
					<i class="fas fa-columns"></i>
				</kx-button>
				<kx-button class="icon green" title="Markdown视图" @click="viewModel = 1">
					<i class="far fa-edit"></i>
				</kx-button>
				<kx-button class="icon green" title="Html视图" @click="viewModel = 2">
					<i class="fas fa-eye"></i>
				</kx-button>
				<kx-button class="primary icon" title="编辑器设置">
					<i class="fas fa-cog"></i>
				</kx-button>
			</template>

		</kx-markdown-edit-window>
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
	height: 100vh;
	overflow-x: hidden;
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
