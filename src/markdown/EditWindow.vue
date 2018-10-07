<template>
	<div class="kx-markdown-main">
		<textarea
			v-show="viewMode !== 2"
			id="textarea"
			ref="textarea"
			class="text-view"
			:class="{
				split:viewMode === 0,
				single:viewMode === 1
			}"
			title="编辑区"
			spellcheck="false"

			:value="text"
			@input="$emit('update:text', $event.target.value)"

			v-bind-selection.focus="selection"
			v-on-selection="handleSelect"
			@keydown.tab.prevent="insertTab">
		</textarea>

		<article
			v-show="viewMode !== 1"
			id="preview"
			ref="preview"
			class="text-view preview markdown"
			:class="{
				split:viewMode === 0,
				single:viewMode === 2
			}"
			v-html="htmlText">
		</article>
	</div>
</template>

<script>
import kxMarkdown, { convertor } from "./index";
import $ from "jquery";


/**
 * 按百分比同步滚动，注意原文与预览的对应内容并非一定在对应百分比的位置上。
 */
function syncScroll() {
	const both = $("#textarea, #preview").not(this).off("scroll");
	const other = both.get(0);
	const percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
	other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
	setTimeout(() => both.on("scroll", syncScroll), 32);
}


export default {
	name: "kxMarkdownEditWindow",
	props: {
		text: {
			type: String,
			default: "",
		},
		selection: {
			type: Array,
			default: () => [],
		},
		viewMode: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		htmlText() {
			this.$nextTick(kxMarkdown.afterConvert);
			return convertor.render(this.text);
		},
	},
	methods: {
		/**
		 * 浏览器默认的tab键用于切换选择的元素。
		 * 在文本框上监听@keydown.tab.prevent="inputTab"，使其能够输入tab字符。
		 */
		insertTab() {
			const { textarea } = this;
			const selStart = textarea.selection[0];
			const selEnd = textarea.selection[1];

			const text = textarea.value;
			textarea.value = text.substring(0, selStart) + "\t" + text.substring(selEnd, text.length);

			const newEnd = selStart + 1;
			textarea.selection = [newEnd, newEnd];
		},
		handleSelect(s, e) {
			this.$emit("update:selection", [s, e]);
		},
	},
	mounted() {
		$("#textarea, #preview").on("scroll", syncScroll);
	},
};
</script>

<style lang="less">

.kx-markdown-toolbar {
	display: flex;
	justify-content: space-between;
	background-color: white;
}

.kx-markdown-main {
	flex: 1;
	overflow: auto;
}

.text-view {
	height: 100%;
	margin: 0;
	padding: 10px 20px 0;

	word-break: break-all;
	line-height: 27px;
	overflow-y: scroll;
	background-color: white;
	border: none;
	resize: none;
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

.kx-markdown-statebar {
	padding: .4rem;
	color: white;
	background-color: #004fff;
}
</style>
