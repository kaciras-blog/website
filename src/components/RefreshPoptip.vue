<template>
	<div>
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
