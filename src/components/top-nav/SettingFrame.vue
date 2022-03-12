<template>
	<kx-frame title="设置">
		<div :class="$style.body"><setting-panel/></div>
	</kx-frame>
</template>

<script setup lang="ts">
import { KxFrame } from "@kaciras-blog/uikit";</script>

<style module lang="less">
.body {
	padding: 15px;
}
</style>
