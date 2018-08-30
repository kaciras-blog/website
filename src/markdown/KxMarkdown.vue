<template>
<div class="markdown-editor">
	<div class="menu">
		<button class="minor icon filled" title="标题" @click="addHeader(2)">
			<i class="fas fa-heading"></i>
		</button>
		<button class="minor icon filled" title="粗体" @click="switchWrapper('**', '**')">
			<i class="fa fa-bold"></i>
		</button>
		<button class="minor icon filled" title="斜体" @click="switchWrapper('_', '_')">
			<i class="fa fa-italic"></i>
		</button>
		<button class="minor icon filled" title="删除线" @click="switchWrapper('~~', '~~')">
			<i class="fa fa-strikethrough"></i>
		</button>
		<button class="minor icon filled" title="行内代码" @click="switchWrapper('`', '`')">
			<i class="fa fa-code"></i>
		</button>
		<button class="minor icon filled" title="横线" @click="addNewLine('- - -')">
			<i class="fa fa-minus"></i>
		</button>
		<button class="minor icon filled" title="代码块" @click="addCode">
			<i class="far fa-file-code"></i>
		</button>
		<button class="minor icon filled" title="引用块" @click="addPrefixToLines('>')">
			<i class="fa fa-quote-left"></i>
		</button>
		<button class="minor icon filled" title="列表" @click="addPrefixToLines('* ')">
			<i class="fas fa-list-ul"></i>
		</button>
		<button class="minor icon filled" title="插入链接" @click="addLink">
			<i class="fa fa-link"></i>
		</button>
		<button class="minor icon filled" title="插入图片" @click="addImage">
			<i class="far fa-file-image"></i>
		</button>

		<!--TODO:视频支持-->
		<button class="minor icon filled" title="插入视频" @click="addHeader(2)">
			<i class="far fa-file-video"></i>
		</button>

		<button class="icon filled" title="双列视图" @click="viewModel=0">
			<i class="fas fa-columns"></i>
		</button>
		<button class="icon filled" title="Markdown视图" @click="viewModel=1">
			<i class="far fa-edit"></i>
		</button>
		<button class="icon filled" title="Html视图" @click="viewModel=2">
			<i class="fas fa-eye"></i>
		</button>
		<button class="icon filled" title="编辑器设置">
			<i class="fas fa-cog"></i>
		</button>
		<button class="icon filled" title="修改简介" @click="metadataDialog">
			<i class="far fa-address-card"></i>
		</button>
		<button class="icon filled" title="保存" @click="save(true)">
			<i class="far fa-save"></i>
		</button>
		<button class="icon filled" title="发布!" @click="publish">
			<i class="far fa-paper-plane"></i>
		</button>
	</div>

	<div class="editor-main">
		<textarea id="textarea" ref="textarea"
				  class="text-view"
				  v-show="viewModel!==2"
				  :class="{ split:viewModel===0, single:viewModel===1 }"
				  title="编辑区"
				  @keydown.9.prevent="inputTab"
				  v-model="content">
		</textarea>
		<article id="preview" ref="preview"
				 class="text-view preview markdown"
				 v-show="viewModel!==1"
				 :class="{ split:viewModel===0, single:viewModel===2 }"
				 v-html="htmlText">
		</article>
	</div>
</div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import textOps from "./TextOperations";
import {assignUpdate} from "../utils";
import convertHtml from "./markdown-convertor";
import api from "../apis";

import AddLinkDialog from "./AddLinkDialog.vue";
import MetadataDialog from "./MetadataDialog.vue";
import CodingDialog from "./CodingDialog.vue";

Vue.component(AddLinkDialog.name, AddLinkDialog);
Vue.component(MetadataDialog.name, MetadataDialog);
Vue.component(CodingDialog.name, CodingDialog);

/**
 * 按百分比同步滚动，注意原文与预览的对应内容并非一定在对应百分比的位置上。
 */
function syncScroll() {
	const both = $("#textarea, #preview").not(this).off("scroll");
	const other = both.get(0);
	const percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
	other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
	setTimeout(() => both.on("scroll", syncScroll), 32); // 最后这个数字越小滚动越平滑
}

function convertToFront(json, data) {
	assignUpdate(json, data);
	assignUpdate(json, data.metadata);
}

function convertToTransfer(data) {
	return Object.assign({
		id: data.draftId,
		articleId: data.articleId,
		content: data.content,
	}, data.metadata);
}

function publish(category) {
	const dto = convertToTransfer(this.$data);
	dto.categories = [category];
	dto.keywords = dto.keywords.split(" ");

	const targetArticleId = dto.articleId;
	delete dto.articleId;

	if (targetArticleId) {
		api.article.update(targetArticleId, dto)
			.then(() => window.location.href = "/article/" + targetArticleId)
			.catch(reason => this.$dialog.messageBox("发表失败", errMsg(reason), "error"));
	} else {
		api.article.publish(dto)
			.then(url => window.location.href = "/article/" + url.substring("/articles/".length))
			.catch(reason => this.$dialog.messageBox("发表失败", errMsg(reason), "error"));
	}
}

export default {
	name: "KxMarkdown",
	data() {
		return {
			metadata: {
				title: "",
				cover: "",
				keywords: "",
				summary: "",
			},
			content: "",
			articleId: null,
			viewModel: 0, // 0分隔，1编辑，2预览
		};
	},
	computed: {
		htmlText() {
			return convertHtml.render(this.content);
		},
	},
	methods: {
		save(manually) {
			const promise = api.draft.save(this.articleId, convertToTransfer(this.$data));
			if (manually) {
				promise.then(() => this.$dialog.messageBox("保存草稿", "保存成功"))
					.catch(() => this.$dialog.messageBox("保存草稿", "保存失败，请手动备份", "error"));
			}
		},
		async addLink() {
			const res = await this.$dialog.show(AddLinkDialog.name, this.$data);
			if (res)
				textOps.addLink.call(this, res.text, res.href);
		},
		addCode() {
			this.$dialog.messageBox("标题222", "3333", "warning");
		},
		publish() {
			this.$dialog.show(selectCategoryDialog.name, null).then(publish.bind(this));
		},
		async metadataDialog() {
			const res =  this.$dialog.show(MetadataDialog.name, {mdata: this.metadata});
			if (res)
				this.metadata = res;
		},
		addImage() {
			api.misc.uploadImageFile()
				.then(textOps.addImageElement.bind(this))
				.catch(err => this.$dialog.messageBox("图片上传失败", err, "error"));
		},
		addPrefixToLines: textOps.addPrefixToLines,
		inputTab: textOps.inputTab,
		switchWrapper: textOps.switchWrapper,
		addHeader: textOps.addHeader,
		addNewLine: textOps.addNewLine,
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
	mounted() {
		$("#textarea, #preview").on("scroll", syncScroll);
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

// 编辑器页面的两个编辑框
.text-view {
	height: 100%;
	word-break: break-all;
	line-height: 27px;
	overflow-y: scroll;
	overflow-x: auto;
	background-color: white;
	border: none;
	padding: 10px 20px 0;
	resize: none;
}

.markdown-editor {
	width: 100%;
	height: 100%;
}

.editor-main {
	height: calc(100% - 36px);
}

.preview {
	float: right;
}

.split {
	width: 50%;
	padding: 10px 20px 0 20px;
}

.single {
	display: block;
	width: 100%;
	padding: 20px 10% 0 10%;
}

.hidden {
	display: none;
}

.menu {
	display: flex;
	justify-content: space-between;

	& > button {
		flex: 1 1 0;
	}
}
</style>

