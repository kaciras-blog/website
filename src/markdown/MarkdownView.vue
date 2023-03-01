<!-- 将 Markdown 转换成 HTML 并显示出来的组件。-->
<template>
	<FinishedMDView :html='html'/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articleRenderer, discussionRenderer } from "./renderer";
import FinishedMDView from "./FinishedMDView.vue";

interface MarkdownViewProps {

	/** 要渲染的 Markdown 文本，注意转换过程是同步的。*/
	value: string;

	/** 给文本设置个唯一 ID，由于区分锚点。*/
	docId?: string;

	/** 是否使用文章转换器，默认使用功能更少也更安全的评论转换器。*/
	isArticle?: boolean;
}

const props = withDefaults(defineProps<MarkdownViewProps>(), {
	isArticle: false,
});

const html = computed(() => {
	const { value, isArticle, docId } = props;
	const renderer = isArticle
		? articleRenderer
		: discussionRenderer;
	return renderer.render(value, { docId });
});
</script>
