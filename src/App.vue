<!-- 很多组件必须跟主实例中挂载，否则功能将受限 -->
<template>
	<kx-progress :ref="connect"/>
	<router-view/>
	<ToastContainer/>
	<kx-dialog-container/>
</template>

<script setup lang="ts">
import type { KxProgress } from "@kaciras-blog/uikit";
import { useDialog, ToastContainer, KxDialogContainer } from "@kaciras-blog/uikit";
import { Unsubscribe } from "nanoevents";
import { events, PrefetchContext } from "./prefetch";
import { useRouter } from "vue-router";

// 切换视图后关掉所有弹窗，因为窗口容器在这里挂载所以也放这了。
// vue-router 4 即使 pushState 未改变 URL 也触发导航，所以检查下路径是否改变了。
const router = useRouter();
const dialog = useDialog();
router.afterEach((to, form) => {
	if (to.fullPath !== form.fullPath)
		dialog.clear();
});

const clean: Unsubscribe[] = [];

function connect(pb: typeof KxProgress | null) {

	function onStart(signal: AbortSignal) {
		pb!.setProgress(30);
		signal.addEventListener("abort", pb!.reset);
	}

	function onPrefetch(ctx: PrefetchContext) {
		const { data, signal } = ctx;

		let value = 50;
		pb!.setProgress(value);
		const tasks = Object.values(data);
		const p = 50 / tasks.length;

		for (const promise of tasks) {
			promise.then(() => signal.aborted || pb!.setProgress(value += p));
		}
	}

	if (pb) {
		if (clean.length > 0) {
			return; // 忽略 ref 可能出现的重复调用。
		}
		clean.push(events.on("start", onStart));
		clean.push(events.on("prefetch", onPrefetch));
		clean.push(events.on("end", pb.finish));
		clean.push(events.on("error", pb.fail));
	} else {
		clean.splice(0, clean.length).forEach(v => v());
	}
}
</script>
