<template>
	<div :ref='setupLazyLoad' class='markdown' v-html='html'></div>
</template>

<script setup lang="ts">
import { noop } from "@vueuse/core";
import { computed } from "vue";
import { activate, articleRenderer, discussionRenderer } from ".";

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

let disconnect = noop;

function setupLazyLoad(el: HTMLElement) {
	if (!el) {
		disconnect();
		disconnect = noop;
	} else if (disconnect === noop) {
		disconnect = activate(el);
	}
}
</script>
