<template>
	<div class="fragment">
		<p>
			<kx-switch-box v-model="appShell">AppShell模式</kx-switch-box>
		</p>
		<p>
			<kx-switch-box v-model="offline">动态内容缓存</kx-switch-box>
		</p>
		<p>
			启用该选项将对动态内容使用 stale-while-revalidate 缓存策略，
			该策略使得访问过的内容无需联网立即加载，但会导致新内容在下一次才能看到。
		</p>
	</div>
</template>

<script>
export default {
	name: "SettingPanel",
	data: () => ({
		appShell: false,
		offline: false,
	}),
};
</script>

<style module lang="less">

</style>
