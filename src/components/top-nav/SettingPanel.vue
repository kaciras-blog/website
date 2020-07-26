<template>
	<div class="fragment">
		<kx-switch-box
			:class="$style.line"
			:disabled="loading"
			:value="StaleApi"
			@input="v => setOption('StaleApi', v)"
		>
			动态内容缓存
		</kx-switch-box>

		<div v-if="loading" :class="$style.alert">
			正在等待ServiceWorker……
		</div>
		<div v-else-if="error" :class="$style.alert">
			无法加载配置
		</div>
		<div v-else>
			该选项将对动态内容使用 stale-while-revalidate 缓存策略，
			这使访问过的内容无需网络立即加载，但新内容在下一次才能看到。
		</div>
	</div>
</template>

<script>
import { getSettings, putSetting } from "@/serviceWorker";

export default {
	name: "SettingPanel",
	data: () => ({
		loading: true,
		error: false,
		StaleApi: false,
	}),
	methods: {
		async setOption(key, value) {
			await putSetting(key, value);
			this[key] = value;
		},
	},
	async beforeMount() {
		// 虽然说如果无法注册SW的话它永远不会resolve，但该组件用得不多，应该不至于内存泄漏。
		await navigator.serviceWorker.ready;
		getSettings()
			.then(settings => Object.assign(this.$data, settings))
			.catch(e => this.error = e)
			.finally(() => this.loading = false);
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
