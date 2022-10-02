<template>
	<span
		v-if='scrollSynced'
		:class='[$style.element, $style.on]'
		@click='scrollSynced = false'
	>
		同步滚动开
	</span>
	<span
		v-else
		:class='[$style.element, $style.off]'
		@click='scrollSynced = true'
	>
		同步滚动关
	</span>
</template>

<script setup lang="ts">
import { AddonContext } from "@/markdown/editor-addon";
import { toRef } from "vue";

interface TextStateGroupProps {
	ctx: AddonContext;
}

const props = defineProps<TextStateGroupProps>();

const scrollSynced = toRef(props.ctx, "scrollSynced");
</script>

<style module lang="less">
.element {
	cursor: pointer;
	user-select: none;
	margin-left: .5em;
}

.on {
	color: #00ee3c;
}

.off {
	color: #ff7070;
}
</style>
