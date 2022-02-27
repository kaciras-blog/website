<template>
	<span>
		<span v-if="selected" :class="$style.item">
			选择：
			{{ selection[0] + " - " + selection[1] }}
			| {{ selection[1] - selection[0] }} 字
		</span>
		<span :class="$style.item">总字数：{{ content.length }}</span>
	</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface InputStateProps {
	content: string;
	selection: [number, number];
}

const props = defineProps<InputStateProps>();

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
