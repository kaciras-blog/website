<template>
	<div class="fragment">
		<kx-switch-box
			:class="$style.line"
			:value="AppShell"
			@input="v => setOption('AppShell', v)"
		>
			AppShell模式
		</kx-switch-box>
		<kx-switch-box
			:class="$style.line"
			:value="StaleApi"
			@input="v => setOption('StaleApi', v)"
		>
			动态内容缓存
		</kx-switch-box>
		<div>
			启用该选项将对动态内容使用 stale-while-revalidate 缓存策略，
			这能使访问过的内容无需联网立即加载，但新内容在下一次才能看到。
		</div>
	</div>
</template>

<script>
import { getConfigs, setConfig } from "@/serviceWorker";

export default {
	name: "SettingPanel",
	data: () => ({
		AppShell: false,
		StaleApi: false,
	}),
	methods: {
		async setOption(key, value) {
			await setConfig(key, value);
			this[key] = value;
		},
	},
	async created() {
		Object.assign(this.$data, await getConfigs());
	},
};
</script>

<style module lang="less">
.line {
	margin-bottom: 1rem;
}
</style>
