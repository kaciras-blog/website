<template>
	<div class="kx-markdown-main">
		<textarea
			v-show="viewMode !== 2"
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
			v-on-selection-changed="handleSelect"
			@keydown.tab.prevent="insertTab">
		</textarea>

		<article
			v-if="renderMode === 'MD'"
			v-show="viewMode !== 1"
			ref="preview"
			class="text-view preview markdown"
			:class="{
				split:viewMode === 0,
				single:viewMode === 2
			}"
			v-html="htmlText">
		</article>
		<pre
			v-else-if="renderMode === 'PLAIN'"
			v-show="viewMode !== 1"
			ref="preview"
			class="text-view preview markdown"
			:class="{
				split:viewMode === 0,
				single:viewMode === 2
			}">{{text}}</pre>
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
		renderMode: {
			type: String,
			default: "MD",
		},
	},
	computed: {
		htmlText () {
			this.$nextTick(kxMarkdown.afterConvert);
			return convertor.render(this.text);
		},
	},
	methods: {
		/**
		 * 浏览器默认的tab键用于切换选择的元素。
		 * 在文本框上监听@keydown.tab.prevent="inputTab"，使其能够输入tab字符。
		 */
		insertTab () {
			const selStart = this.selection[0];
			const selEnd = this.selection[1];

			const v = this.text;
			const newEnd = selStart + 1;

			this.$emit("update:text", v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length));
			this.$emit("update:selection", [newEnd, newEnd]);
		},
		handleSelect (s, e) {
			this.$emit("update:selection", [s, e]);
		},
	},
	mounted () {
		const { textarea, preview } = this.$refs;
		textarea.addEventListener("scroll", syncScroll);
		preview.addEventListener("scroll", syncScroll);

		/**
		 * 按百分比同步滚动，注意原文与预览的对应内容并非一定在对应百分比的位置上。
		 * BUG: Firefox 有一个操蛋的平滑滚动功能
		 */
		function syncScroll (event) {
			let el = textarea;
			let other = preview;

			if(event.target !== el) {
				el = preview;
				other = textarea;
			}

			el.removeEventListener("scroll", syncScroll);
			const percentage = el.scrollTop / (el.scrollHeight - el.offsetHeight);
			other.scrollTop = Math.round(percentage * (other.scrollHeight - other.offsetHeight));
			setTimeout(() => el.addEventListener("scroll", syncScroll), 10);
		}
	},
};
</script>

<style lang="less">
@import "../css/Imports";

.kx-markdown-main {
	flex: 1;
	overflow: hidden;
}

.text-view {
	display: inline-block;
	height: 100%;

	margin: 0;
	padding: .5rem 1rem 0 1rem;

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
}

.single {
	display: block;
	width: 100%;

	@media screen and (min-width: @length-screen-mobile) {
		padding-left: 10%;
		padding-right: 10%;
	}
	@media screen and (min-width: @length-screen-wide) {
		padding-left: 16%;
		padding-right: 16%;
	}
}

.kx-markdown-statebar {
	display: flex;
	justify-content: space-between;
	padding: .4rem;
	color: white;
	background-color: #003ee7;
}
</style>
