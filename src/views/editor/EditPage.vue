<template>
	<main :class="$style.container">
		<div :class="$style.toolbar" role="toolbar">
			<div>
				<kx-markdown-basic-toolbar :text.sync="content" :selection.sync="selection"/>
				<kx-button class="minor" title="插入图片" icon="far fa-file-image" @click="addImage"/>
			</div>
			<div>
				<view-mode-toolbar :view-mode.sync="viewMode"/>
				<kx-button class="primary" title="修改简介" icon="far fa-address-card" @click="metadataDialog"/>
				<kx-button class="primary" title="保存" icon="far fa-save" @click="manualSave"/>
				<kx-button class="primary" title="发布!" icon="far fa-paper-plane" @click="publish"/>
			</div>
		</div>

		<kx-markdown-edit-window
			:text.sync="content"
			:selection.sync="selection"
			:view-mode="viewMode"
		/>

		<div :class="$style.stateBar">
			<div>
				<span v-if="autoSaveError" :class="$style.errMsg">
					自动保存出错！
				</span>
				<span v-else-if="archive.saveTime">
					上次保存：{{archive.saveTime | localDateMinute}}
				</span>
			</div>
			<div>
				<text-state-group :text="content" :selection="selection"/>
			</div>
		</div>
	</main>
</template>

<script>
import api from "@/api";
import { VueMultiWatcher, openFile } from "@kaciras-blog/uikit";
import { assignUpdate, errorMessage, getImageSize } from "@/utils";
import KxMarkdownEditWindow from "@/markdown/EditWindow";
import KxMarkdownBasicToolbar from "@/markdown/BasicToolbar";
import TextStateGroup from "@/markdown/TextStateGroup";
import ViewModeToolbar from "@/markdown/ViewModeToolbar";
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
		ViewModeToolbar,
		KxMarkdownBasicToolbar,
		KxMarkdownEditWindow,
		TextStateGroup,
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
		selection: [0, 0],
		viewMode: 0,

		/** 是否有在未保存的改动 */
		changes: false,

		autoSaveError: null,
	}),
	watch: {
		metadata() { this.changes = true; },
		content() { this.changes = true; },
	},
	methods: {
		async addImage() {
			const file = await openFile("image/*");

			// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学到的
			const { width, height } = await getImageSize(file);
			const res = await api.misc.uploadImage(file) + `?vw=${width}&vh=${height}`;

			const [selStart, selEnd] = this.selection;
			const p = selStart + 2;
			const v = this.content;

			this.content = v.substring(0, selEnd) + `![](${res})` + v.substring(selEnd);
			this.selection = [p, p];
		},

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
			const article = await this.$dialog.show(PublishDialog, this.$data);
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

.toolbar {
	display: flex;
	justify-content: space-between;
	background-color: whitesmoke;
}

.stateBar {
	display: flex;
	justify-content: space-between;
	padding: .4rem;
	color: white;
	background-color: #003ee7;
}
</style>
