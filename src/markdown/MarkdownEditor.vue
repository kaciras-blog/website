<template>
	<div :class='$style.container'>
		<div :class='$style.toolbar' role='toolbar'>
			<slot name='toolbar-left' :ctx='ctx'/>
			<span :class='$style.span'></span>
			<slot name='toolbar-right' :ctx='ctx'/>
		</div>

		<textarea
			v-show='viewMode !== ViewMode.Preview'
			ref='textareaEl'
			:class='{
				[$style.textarea]: true,
				[$style.window]: true,
				[$style.single]: viewMode === ViewMode.Edit,
			}'
			title='编辑区'
			spellcheck='false'
			v-model='content'
			v-bind-selection.focus='selection'
			v-on-selection-change='selection'
			@dragover.prevent
			@drop='handleDrop'
			@keydown.tab.prevent='insertTab'
			@scroll='lastScrollPreview = false'
		/>
		<MarkdownView
			v-show='viewMode !== ViewMode.Edit'
			ref='previewEl'
			:is-article='true'
			:value='outMarkdown'
			:class='{
				[$style.window]: true,
				[$style.single]: viewMode === ViewMode.Preview,
			}'
			@scroll='lastScrollPreview = true'
		/>

		<div :class='$style.statebar'>
			<slot name='statebar-left' :ctx='ctx'/>
			<span :class='$style.span'></span>
			<slot name='statebar-right' :ctx='ctx'/>

			<TextStateGroup :ctx='ctx'/>
			<SyncScrollToggle :ctx='ctx'/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, reactive, ref } from "vue";
import { refDebounced, useVModel } from "@vueuse/core";
import { syncScroll } from "@kaciras/utilities/browser";
import { AddonContext, ViewMode } from "./editor-addon";
import MarkdownView from "./MarkdownView.vue";
import TextStateGroup from "./TextStateGroup.vue";
import SyncScrollToggle from "./SyncScrollToggle.vue";

type DropHandler = (files: FileList, ctx: AddonContext) => boolean | void;

interface MarkdownEditorProps {
	modelValue: string;
	debounce?: number;
	dropHandler: DropHandler;
}

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
	debounce: 500,
	dropHandler: () => false,
});

const emit = defineEmits(["update:modelValue"]);

const content = useVModel(props, "modelValue", emit);
const selection = ref<[number, number]>([0, 0]);
const viewMode = ref(ViewMode.Split);
const outMarkdown = refDebounced(content, props.debounce);

const textareaEl = ref<HTMLElement>();
const previewEl = ref<ComponentPublicInstance>();
const lastScrollPreview = ref(false);
const disableSyncScroll = ref<(() => void) | null>(null);

/**
 * 设置是否启用同步滚动，如果由关闭变为开启则会立即触发同步。
 *
 * 立即同步时以最后滚动的一方作为目标，另一方调整滚动位置与对方同步。
 */
const scrollSynced = computed({
	get: () => Boolean(disableSyncScroll.value),
	set(enabled) {
		const disable = disableSyncScroll.value;

		if (!enabled && disable) {
			disableSyncScroll.value = null;
			return disable();
		}

		const preview = previewEl.value!.$el;
		const textarea = textareaEl.value!;

		disableSyncScroll.value = lastScrollPreview.value
			? syncScroll(preview, textarea)
			: syncScroll(textarea, preview);
	},
});

/**
 * 官网上说紧密耦合的组件使用可变 props 也行。
 * https://vuejs.org/guide/components/props.html#mutating-object-array-props
 */
const ctx = reactive({
	viewMode,
	selection,
	content,
	scrollSynced,
});

function handleDrop(event: DragEvent) {
	const { files } = event.dataTransfer!;
	if (props.dropHandler(files, ctx)) {
		return event.preventDefault();
	}
}

/**
 * 浏览器默认的 tab 键用于切换选择的元素。
 * 在文本框上监听 @keydown.tab.prevent="inputTab"，使其能够输入 tab 字符。
 */
function insertTab() {
	const [selStart, selEnd] = selection.value;

	const v = props.modelValue;
	const newEnd = selStart + 1;

	content.value = v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length);
	selection.value = [newEnd, newEnd];
}

onMounted(() => scrollSynced.value = true);
</script>

<style module lang="less">
@import "../css/imports";

.container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto 1fr auto;
}

.window {
	margin: 0;
	padding: .5rem .8rem 0 .8rem;
	border: none;

	font-size: initial;
	background-color: white;
	resize: none;
	overflow-y: scroll;
}

.toolbar {
	grid-column: 1/3;

	display: flex;
	background-color: whitesmoke;
	--btn-radius: 0;
}

.span {
	flex: 1;
}

.statebar {
	grid-column: 1/3;

	display: flex;
	line-height: 22px;
	padding: 0 .5em;
	color: white;
	background-color: #003ee7;
}

.textarea {
	font-size: initial;
	word-break: break-all;
	line-height: 1.8;
	border-right: solid 1px #ddd;

	&:focus-within {
		box-shadow: none;
	}
}

.single {
	display: block;
	grid-column: 1/3;

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
