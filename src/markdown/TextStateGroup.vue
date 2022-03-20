<template>
	<span>
		<span v-if="selected" :class="$style.item">
			选择：
			{{ props.selection[0] + " - " + props.selection[1] }}
			| {{ props.selection[1] - props.selection[0] }} 字
		</span>
		<span :class="$style.item">总字数：{{ props.content.length }}</span>
	</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEditorContext } from "@/markdown/editor-addon";

const props = useEditorContext();

const selected = computed(() => {
	const [start, end] = props.selection;
	return start !== end;
});
</script>

<style module lang="less">
.item {
	margin: 0 .5em;
}
</style>
