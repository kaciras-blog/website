<template>
	<div class='btn-group console-toolbar'>
		<KxButton @click='gc'>
			强制执行 GC
		</KxButton>
		<KxButton
			target='__blank'
			href='/diagnostics/v8'
		>
			V8 统计
		</KxButton>
		<KxButton
			color='dangerous'
			href='/diagnostics/heap-dump'
		>
			堆转储（较慢）
		</KxButton>
	</div>
</template>

<script setup lang='ts'>
import { KxButton, useToast } from "@kaciras-blog/uikit";
import api from "@/api";

const toast = useToast();

function gc() {
	return api.diagnostics.runGC()
		.then(() => toast.success("GC 已提交执行"))
		.catch(e => toast.error(`执行失败（${e.code}）`));
}
</script>
