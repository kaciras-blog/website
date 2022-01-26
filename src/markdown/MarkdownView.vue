<template>
	<div :ref="setupLazyLoad" class="markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articleRenderer, discussionRenderer, initLazyLoading } from ".";

interface MarkdownViewProps {
	value: string;
	isArticle: boolean;
}

const props = defineProps<MarkdownViewProps>();

const html = computed(() => {
	const renderer = props.isArticle
		? articleRenderer
		: discussionRenderer;
	return renderer.render(props.value);
});

let disconnect = () => {};

function setupLazyLoad(el: HTMLElement) {
	if (!el) {
		disconnect();
	}
	disconnect = initLazyLoading(el);
}
</script>
