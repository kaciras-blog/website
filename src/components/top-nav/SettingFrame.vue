<template functional>
	<kx-frame>
		<kx-frame-header title="设置"/>
		<div :class="$style.body"><setting-panel/></div>
	</kx-frame>
</template>

<script>
export default {
	name: "SettingFrame",
};
</script>

<style module lang="less">
.body {
	padding: 15px;
}
</style>
