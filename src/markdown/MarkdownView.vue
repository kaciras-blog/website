<template>
	<div :ref="setupLazyLoad" class="markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articleRenderer, discussionRenderer, initLazyLoading } from ".";
import { NOOP } from "@/utils";

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

let disconnect = NOOP;

function setupLazyLoad(el: HTMLElement) {
	if (!el) {
		disconnect();
		disconnect = NOOP;
	} else if (disconnect === NOOP) {
		disconnect = initLazyLoading(el);
	}
}
</script>
