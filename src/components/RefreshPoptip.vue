<template>
	<div :class="$style.container">
		该页面有更新，请
		<a class="hd-link" @click="refresh">刷新查看</a>
	</div>
</template>

<script>
export default {
	name: "RefreshPoptip",
	methods: {
		refresh() { window.location.reload(); },
	},
};
</script>

<style module lang="less">
.container {
	padding: 8px 12px;
	border-radius: 5px;
	background-color: #222;
	color: white;
}
</style>
