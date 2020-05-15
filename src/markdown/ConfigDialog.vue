<template>
	<kx-base-dialog title="编辑器设置">
		<form>
			<label>
				刷新延迟
				<input type="number" v-model="refreshDelay">
			</label>
			<label>
				自动保存时间间隔
				<input type="number" v-model="autoSaveDelay">
			</label>
		</form>
		<kx-standard-dialog-buttons @ok="$dialog.confirm($data)"/>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "ConfigDialog",
	props: ["config"],
	data() {
		return Object.assign({}, this.config);
	},
};
</script>

<style module lang="less">

</style>
