<template>
	<kx-base-dialog title="设置" :class="$style.dialog">
		<setting-panel/>
		<kx-dialog-buttons :on-accept="$dialog.close"/>
	</kx-base-dialog>
</template>

<script setup lang="ts">
import { KxDialogButtons } from "@kaciras-blog/uikit";
</script>

<style module>
.dialog { width: 30rem; }
</style>
