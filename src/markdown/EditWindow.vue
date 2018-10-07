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
			const selStart = this.selection[0];
			const selEnd = this.selection[1];

			const v = this.text;
			const newEnd = selStart + 1;

			this.$emit("update:text", v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length));
			this.$emit("update:selection", [newEnd, newEnd]);
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
	background-color: whitesmoke;
}

.kx-markdown-main {
	flex: 1;
	overflow: hidden;
}

.text-view {
	display: inline-block;
	height: 100%;

	margin: 0;
	padding: 1rem 1rem 0;

	overflow-y: scroll;
	overflow-x: hidden;

	border: none;
	background-color: white;
	resize: none;

	font-size: 1rem;
	word-break: break-all;
	line-height: 27px;
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
