<template>
	<div :class='$style.container'>
		<div :class='$style.toolbar' role='toolbar'>
			<slot name='toolbar-left' :ctx='ctx'/>
			<span :class='$style.span'></span>
			<slot name='toolbar-right' :ctx='ctx'/>
		</div>

		<div :class='$style.main'>
			<textarea
				v-show='viewMode !== ViewMode.Preview'
				ref='textareaEl'
				:class='{
					[$style.textarea]: true,
					[$style.window]: true,
					[$style.split]: viewMode === ViewMode.Split,
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
			<article
				v-show='viewMode !== ViewMode.Edit'
				v-html='html'
				ref='previewEl'
				class='markdown'
				:class='{
					[$style.window]: true,
					[$style.split]: viewMode === ViewMode.Split,
					[$style.single]: viewMode === ViewMode.Preview,
				}'
				@scroll='lastScrollPreview = true'
			/>
		</div>

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
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
import { useVModel } from "@vueuse/core";
import { syncScroll } from "@kaciras-blog/uikit";
import { activate, articleRenderer } from ".";
import { AddonContext, ViewMode } from "./editor-addon";
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

const html = ref(articleRenderer.render(props.modelValue));

const textareaEl = ref<HTMLElement>();
const previewEl = ref<HTMLElement>();
const lastScrollPreview = ref(false);
const disableSyncScroll = ref<(() => void) | null>(null);

let disconnect: () => void;
let timer: any;

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

		const preview = previewEl.value!;
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
 * 浏览器默认的tab键用于切换选择的元素。
 * 在文本框上监听@keydown.tab.prevent="inputTab"，使其能够输入tab字符。
 */
function insertTab() {
	const [selStart, selEnd] = selection.value;

	const v = props.modelValue;
	const newEnd = selStart + 1;

	content.value = v.substring(0, selStart) + "\t" + v.substring(selEnd, v.length);
	selection.value = [newEnd, newEnd];
}

// watchEffect 在 setup 阶段就调用，所以要检查 previewEl。
watchEffect(() => {
	const { modelValue } = props;

	const render = async () => {
		html.value = articleRenderer.render(modelValue);
		await nextTick();

		if (disconnect) {
			disconnect();
		}
		if (!previewEl.value) {
			return;
		}
		disconnect = activate(previewEl.value);
	};

	clearTimeout(timer);
	timer = setTimeout(render, props.debounce);
});

onMounted(() => scrollSynced.value = true);
onUnmounted(() => disconnect?.());
</script>

<style module lang="less">
@import "../css/imports";

.container {
	display: flex;
	flex-direction: column;
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
	display: flex;
	background-color: whitesmoke;
	--btn-radius: 0;
}

.span {
	flex: 1;
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

.main {
	display: flex;
	flex: 1;
	overflow: hidden;
}

.textarea {
	font-size: initial;
	word-break: break-all;
	line-height: 1.8;
	border-right: solid 1px #ddd;
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
