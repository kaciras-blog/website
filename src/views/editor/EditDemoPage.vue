<template>
	<MarkdownEditor
		:model-value='initialContext'
		class='editor-page'
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
import {
	BaseSyntaxWeights,
	ConfigWeights,
	MarkdownEditor,
	MediaWeights,
	SelectionWeight,
} from "@kaciras-blog/markdown-vue";
import PageMeta from "@/components/PageMeta.ts";
import initialContext from "./manual.md?raw";
</script>
