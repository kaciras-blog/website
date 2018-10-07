<template>
	<div>
		<div class="kx-markdown-toolbar">
			<div class="kx-markdown-toolbar-left">
				<slot name="toolbar-left"/>
			</div>
			<div class="kx-markdown-toolbar-right">
				<slot name="toolbar-right"/>
			</div>
		</div>

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
				@keydown.tab.prevent="inputTab"
				@input="handleInput"
				@click="handleSelect"
				@keydown="handleSelect">
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

		<div class="kx-markdown-statebar">
			<div class="kx-markdown-statebar-left">{{selection[0] + " - " + selection[1]}}</div>
			<div class="kx-markdown-statebar-right">
				<slot name="statebar-right"/>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable no-unused-vars */

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
	setTimeout(() => both.on("scroll", syncScroll), 32); // 最后这个数字越小滚动越平滑
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
			default: () => [0, 0],
		},
		viewMode: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			test: 0,
		};
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
		inputTab() {
			const [selStart, selEnd] = getSelectedRange.apply(this, [false]);
			const v = this.content.substring(selStart, selEnd);
			const selen = selStart + 1 - v.length;
			changeTextArea.apply(this, [selStart, selEnd, "\t"]);
			reselect.call(this, selen, selen);
		},
		handleInput(event) {
			this.$emit("update:text", event.target.value);
		},
		handleSelect(event) {
			const area = event.target;
			this.$emit("update:selection", [area.selectionStart, area.selectionEnd]);
		},
	},
	mounted() {
		$("#textarea, #preview").on("scroll", syncScroll);
	},
};
</script>

<style lang="less">
.kx-markdown-main {
	height: calc(100% - 48px - .8rem);
}

.text-view {
	height: 100%;
	margin: 0;
	padding: 10px 20px 0;

	word-break: break-all;
	line-height: 27px;
	overflow-y: scroll;
	overflow-x: auto;
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
