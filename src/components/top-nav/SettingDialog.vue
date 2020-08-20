<template>
	<kx-base-dialog title="设置" :class="$style.dialog">
		<setting-panel/>
		<kx-standard-dialog-buttons :cancel-button="false"/>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "SettingDialog",
};
</script>

<style module lang="less">
.dialog > :global(.kx-dialog) {
	width: 30rem;
}
</style>
