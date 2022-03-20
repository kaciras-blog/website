<template>
	<span
		v-if="context.scrollSynced"
		:class="[$style.element, $style.on]"
		@click="context.scrollSynced = false"
	>
		同步滚动开
	</span>
	<span
		v-else
		:class="[$style.element, $style.off]"
		@click="context.scrollSynced = true"
	>
		同步滚动关
	</span>
</template>

<script setup lang="ts">
import { useEditorContext } from "@/markdown/editor-addon";

const context = useEditorContext();
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
