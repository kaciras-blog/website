<!--
	显示已经转换好的 Markdown HTML，并激活它。
	该组件不引入转换器，配合后端生成好的页面可以减轻 JS 文件。
-->
<template>
	<div :ref='setup' class='markdown' v-html='html'/>
</template>

<script setup lang="ts">
import { noop } from "@vueuse/core";
import "./markdown.less";
import { activate } from ".";

interface FinishedMDViewProps {
	html: string;
}

defineProps<FinishedMDViewProps>();

let disconnect = noop;

function setup(el: HTMLElement | null) {
	if (!el) {
		disconnect();
		disconnect = noop;
	} else if (disconnect === noop) {
		disconnect = activate(el);
	}
}
</script>
