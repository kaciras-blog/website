<template>
	<kx-base-dialog title="设置" :class="$style.dialog">
		<p>
			<kx-switch-box v-model="offline">启用离线模式</kx-switch-box>
		</p>
		<p>
			启用该选项将对动态内容使用 stale-while-revalidate 缓存策略，
			该策略使得访问过的内容无需联网立即加载，但会导致新内容在下一次才能看到。
		</p>
		<kx-standard-dialog-buttons :cancel-button="false"/>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "SettingDialog",
	data: () => ({ offline: false }),
};
</script>

<style module lang="less">
.dialog > :global(.kx-dialog) {
	width: 30rem;
}
</style>
