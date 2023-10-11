<template>
	<MarkdownEditor
		class='editor-page'
		v-model='content'
	>
		<template #toolbar-left>
			<PageMeta title='评论说明' body-class=''/>

			<BaseSyntaxWeights></BaseSyntaxWeights>
			<MediaWeights></MediaWeights>
		</template>
		<template #toolbar-right>
			<ConfigWeights></ConfigWeights>
		</template>
		<template #status-right>
			<SelectionWeight></SelectionWeight>
		</template>
	</MarkdownEditor>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
	BaseSyntaxWeights,
	ConfigWeights,
	MarkdownEditor,
	MediaWeights,
	SelectionWeight,
} from "@kaciras-blog/markdown-vue";
import PageMeta from "@/components/PageMeta.ts";
import manual from "./manual.md?raw";

const content = ref(manual);
</script>
