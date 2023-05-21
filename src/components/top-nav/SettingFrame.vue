<template>
	<KxFrame title='设置'>
		<div :class='$style.body'><SettingPanel/></div>
	</KxFrame>
</template>

<script setup lang="ts">
import { KxFrame } from "@kaciras-blog/uikit";
import SettingPanel from "./SettingPanel.vue";
</script>

<style module lang="less">
.body {
	padding: 15px;
}
</style>
