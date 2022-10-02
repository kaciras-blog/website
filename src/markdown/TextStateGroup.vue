<template>
	<span v-if='start !== end' :class='$style.item'>
		选择：{{ start + " - " + end }} | {{ end - start }} 字
	</span>
	<span :class='$style.item'>总字数：{{ ctx.content.length }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AddonContext } from "./editor-addon";

interface TextStateGroupProps {
	ctx: AddonContext;
}

const props = defineProps<TextStateGroupProps>();

const start = computed(() => props.ctx.selection[0]);
const end = computed(() => props.ctx.selection[1]);
</script>

<style module lang="less">
.item {
	margin: 0 .5em;
}
</style>
