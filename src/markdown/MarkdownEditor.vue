<template>
	<div :class="$style.container">

		<div :class="$style.toolbar" role="toolbar">
			<div :class="$style.left_items"><slot name="tools-left" :ctx="this"/></div>
			<div :class="$style.right_items"><slot name="tools-right" :ctx="this"/></div>
		</div>

		<div :class="$style.main">
			<textarea
				v-show="viewMode !== 2"
				ref="textarea"
				:class="{
					[$style.textbox]: true,
					[$style.split]:viewMode === 0,
					[$style.single]:viewMode === 1,
				}"
				title="编辑区"
				spellcheck="false"
				:value="value"
				v-selection-model.focus="selection"
				@keydown.tab.prevent="insertTab"
				@input="$emit('input', $event.target.value)"
			/>
			<article
				v-show="viewMode !== 1"
				v-html="html"
				ref="preview"
				class="markdown"
				:class="{
					[$style.textbox]: true,
					[$style.split]:viewMode === 0,
					[$style.single]:viewMode === 2,
				}"
			/>
		</div>

		<div :class="$style.statebar">
			<div :class="$style.left_items"><slot name="state-left" :ctx="this"/></div>
			<div :class="$style.right_items"><slot name="state-right" :ctx="this"/></div>
		</div>
	</div>
</template>

<script>
import { syncScroll } from "@kaciras-blog/uikit";
import { initLazyLoading, renderMarkdown } from "./index";

export default {
	name: "MarkdownEditor",
	props: {
		value: {
			type: String,
			default: "",
		},
		debounce: {
			type: Number,
			default: 500,
		},
	},
	data() {
		return {
			selection: [0, 0],
			viewMode: 0,
			html: renderMarkdown(this.value),
		};
	},
	computed: {
		content: {
			get() { return this.value; },
			set(value) { this.$emit("input", value); },
		},
	},
	watch: {
		// 加个防抖免得右边老闪，另外注意刷新后清理监听器防止内存泄漏
		value(newValue) {
			const render = async () => {
				this.html = renderMarkdown(newValue);
				await this.$nextTick();

				if (this.$_lazyWatcher) {
					this.$_lazyWatcher();
				}
				this.$_lazyWatcher = initLazyLoading(this.$refs.preview);
			};

			if (this.$_timer) {
				clearTimeout(this.$_timer);
			}
			this.$_timer = setTimeout(render, this.debounce);
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

			const v = this.value;
			const newEnd = selStart + 1;

			this.content = v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length);
			this.selection = [newEnd, newEnd];
		},

		/**
		 * 替换一段区域内的文本，并选中替换的部分。
		 *
		 * @param start 替换起点
		 * @param end 替换终点
		 * @param value 替换的文本
		 */
		replaceArea(start, end, value) {
			const v = this.value;
			this.content = v.substring(0, start) + value + v.substring(end, v.length);
			this.selection = [start, start + value.length];
		},
	},
	mounted() {
		syncScroll(this.$refs.textarea, this.$refs.preview);
	},
};
</script>

<style module lang="less">
@import "../css/imports";

.container {
	display: flex;
	flex-direction: column;
}

.toolbar {
	display: flex;
	background-color: whitesmoke;
}

.statebar {
	display: flex;
	line-height: 22px;
	padding: 0 .5em;
	color: white;
	background-color: #003ee7;
}

.left_items {
	display: flex;
	flex-grow: 1;
}

/*.right_items {*/
/*	display: flex;*/
/*	flex-direction: row-reverse;*/
/*	flex-wrap: wrap;*/
/*}*/

// =========================================

.main {
	display: flex;
	flex: 1;
	overflow: hidden;
}

.textbox {
	margin: 0;
	padding: .5rem .8rem 0 .8rem;
	border: none;

	background-color: white;
	resize: none;
	overflow-y: scroll;

	font-size: initial;
	word-break: break-all;
	line-height: 1.67;
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
</style>
