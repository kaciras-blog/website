<template>
	<div :ref="setupLazyLoad" class="markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articleRenderer, discussionRenderer, initLazyLoading } from ".";
import { NOOP } from "@/utils";

interface MarkdownViewProps {
	value: string;
	isArticle?: boolean;
}

const props = withDefaults(defineProps<MarkdownViewProps>(), {
	isArticle: false,
});

const html = computed(() => {
	const renderer = props.isArticle
		? articleRenderer
		: discussionRenderer;
	return renderer.render(props.value);
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
