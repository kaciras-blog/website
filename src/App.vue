<!-- 很多组件必须跟主实例中挂载，否则功能将受限 -->
<template>
	<kx-progress :ref="connect"/>
	<router-view/>
	<kx-dialog-container/>
</template>

<script setup lang="ts">
import type { KxProgress } from "@kaciras-blog/uikit";
import { Unsubscribe } from "nanoevents";
import { events, PrefetchContext } from "./prefetch";

const clean: Unsubscribe[] = [];

function connect(pb: KxProgress | null) {

	function onStart(signal: AbortSignal) {
		pb.start();
		signal.addEventListener("abort", pb.reset)
	}

	function onPrefetch(ctx: PrefetchContext) {
		pb.setProgress(60);
	}

	if (pb) {
		if (clean.length > 0) {
			return; // 忽略 ref 可能出现的重复调用。
		}
		clean.push(events.on("start", onStart));
		clean.push(events.on("prefetch", onPrefetch))
		clean.push(events.on("end", pb.finish));
		clean.push(events.on("error", pb.fail));
	} else {
		clean.splice(0, clean.length).forEach(v => v());
	}
}
</script>
