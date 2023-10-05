<template>
	<KxBaseDialog title='设置' :class='$style.dialog'>
		<SettingPanel/>
		<KxDialogButtons :on-accept='$dialog.close'/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { KxBaseDialog, KxDialogButtons } from "@kaciras-blog/uikit";
import SettingPanel from "./SettingPanel.vue";
</script>

<style module>
.dialog { width: 30rem; }
</style>
