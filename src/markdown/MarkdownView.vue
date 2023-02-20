<!-- 将 Markdown 转换成 HTML 并显示出来的组件。-->
<template>
	<FinishedMDView :html='html'/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articleRenderer, discussionRenderer } from ".";
import FinishedMDView from "./FinishedMDView.vue";

interface MarkdownViewProps {
	value: string;
	docId?: any;
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
