<template>
	<div>
		<div :class="$style.toolbar" role="toolbar">
			<basic-toolbar :text.sync="content" :selection.sync="selection"/>
			<div>
				<kx-button class="info" title="双列视图" icon="fas fa-columns" @click="viewMode = 0"/>
				<kx-button class="info" title="Markdown视图" icon="far fa-edit" @click="viewMode = 1"/>
				<kx-button class="info" title="Html视图" icon="fas fa-eye" @click="viewMode = 2"/>
			</div>
		</div>

		<div class="kx-markdown-main">
			<textarea
				v-show="viewMode !== 2"
				ref="textarea"
				class="text-view"
				:class="{
					split:viewMode === 0,
					single:viewMode === 1,
				}"
				title="编辑区"
				spellcheck="false"
				:value="text"
				v-bind-selection.focus="selection"
				v-on-selection-changed="handleSelect"
				@keydown.tab.prevent="insertTab"
				@input="$emit('update:text', $event.target.value)"
			/>
			<article
				v-if="renderMode === 'MD'"
				v-show="viewMode !== 1"
				v-html="html"
				ref="preview"
				class="text-view preview markdown"
				:class="{
					split:viewMode === 0,
					single:viewMode === 2,
			}"
			/>
			<pre
				v-else-if="renderMode === 'PLAIN'"
				v-show="viewMode !== 1"
				v-text="text"
				ref="preview"
				class="text-view preview markdown"
				:class="{
					split:viewMode === 0,
					single:viewMode === 2,
				}"
			/>
		</div>

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
				<span v-if="selected" :class="$style.item">
					选择：
					{{selection[0] + " - " + selection[1]}}
					| {{ selection[1] - selection[0] }} 字
				</span>
				<span :class="$style.item">总字数：{{ text.length }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { renderMarkdown, enableLazyLoad } from "./index";
import BasicToolbar from "./BasicToolbar";

export default {
	name: "kxMarkdownEditWindow",
	components: {
		BasicToolbar,
	},
	props: {
		text: {
			type: String,
			default: "",
		},
		renderMode: {
			type: String,
			default: "MD",
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
			html: renderMarkdown(this.text),
		};
	},
	computed: {
		content: {
			get() { return this.text; },
			set(value) { this.$emit("update:text", value); },
		},
	},
	watch: {
		// 加个防抖免得右边老闪，另外注意刷新后清理监听器防止内存泄漏
		text(newValue) {
			const render = async () => {
				this.html = renderMarkdown(newValue);
				await this.$nextTick();

				if (this.$_lazyWatcher) {
					this.$_lazyWatcher();
				}
				this.$_lazyWatcher = enableLazyLoad(this.$refs.preview);
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

			const v = this.text;
			const newEnd = selStart + 1;

			this.content = v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length);
			this.selection = [newEnd, newEnd];
		},

		handleSelect(s, e) {
			this.selection = [s, e];
		},
	},
	mounted() {
		const { textarea, preview } = this.$refs;
		textarea.addEventListener("scroll", syncScroll);
		preview.addEventListener("scroll", syncScroll);

		/**
		 * 按百分比同步滚动，注意原文与预览的对应内容并非一定在对应百分比的位置上。
		 * BUG: Firefox 有一个操蛋的平滑滚动功能
		 */
		function syncScroll(event) {
			let el = textarea;
			let other = preview;

			if (event.target !== el) {
				el = preview;
				other = textarea;
			}
			const percentage = el.scrollTop / (el.scrollHeight - el.offsetHeight);
			other.scrollTop = Math.round(percentage * (other.scrollHeight - other.offsetHeight));

			el.removeEventListener("scroll", syncScroll);
			requestAnimationFrame(() => el.addEventListener("scroll", syncScroll));
		}
	},
};
</script>

<style lang="less">
@import "../css/imports";

.kx-markdown-main {
	flex: 1;
	overflow: hidden;
}

.text-view {
	display: inline-block;
	height: 100%;

	margin: 0;
	padding: .5rem 1rem 0 1rem;
	vertical-align: top;

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
</style>

<style module lang="less">
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
