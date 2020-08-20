<template>
	<div class="fragment">
		<kx-switch-box
			:class="$style.line"
			:disabled="unsupported || loading"
			:value="StaleApi"
			@input="v => setOption('StaleApi', v)"
		>
			动态内容缓存
		</kx-switch-box>

		<div v-if="unsupported" :class="$style.alert">
			您的浏览器不支持 ServiceWorker，无法使用该功能
		</div>
		<div v-else-if="loading" :class="$style.alert">
			正在连接 ServiceWorker……
		</div>
		<div v-else class="minor-text">
			该选项将对动态内容使用 stale-while-revalidate 缓存策略，
			这能让访问过的内容无需网络立即加载，但新内容会被延迟到下一次访问。
		</div>
	</div>
</template>

<script>
import { getSettings, putSetting } from "@/service-worker/client/settings";

export default {
	name: "SettingPanel",
	data: () => ({
		loading: true,
		StaleApi: false,
	}),
	computed: {
		unsupported() {
			return !("serviceWorker" in navigator);
		},
	},
	methods: {
		async setOption(key, value) {
			await putSetting(key, value);
			this[key] = value;
		},
	},
	async beforeMount() {
		// 虽然说如果无法注册SW的话它永远不会resolve，但该组件用得不多，应该不至于内存泄漏。
		await navigator.serviceWorker.ready;
		Object.assign(this.$data, await getSettings());
		this.loading = false;
	},
};
</script>

<style module lang="less">
.line {
	margin-bottom: 1rem;
}

.alert {
	color: red;
	text-align: center;
}
</style>
