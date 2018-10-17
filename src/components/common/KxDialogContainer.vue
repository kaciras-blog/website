<template>
	<div v-show="stack.length"
		 class="kx-dialog-container">
		<component
				v-for="(dialog, index) in stack"
				:key="dialog.id"
				:is="dialog.component"
				v-show="index === stack.length - 1"
				v-bind="dialog.data"/>
	</div>
</template>

<script>
export default {
	name: "KxDialogContainer",
	data: () => ({
		stack: [], // {id, component, data, callback} 4元组
		counter: 0,
	}),
	created () {
		this.$dialog.eventBus.$on("show", config => {
			config.id = ++this.counter;
			this.stack.push(config);
		});

		this.$dialog.eventBus.$on("close", data => {
			const config = this.stack.pop();
			if (!config) {
				throw new Error("当前没有可关闭的弹窗");
			}
			config.resolve(data);
		});
	},
};
</script>

<style lang="less">
.kx-dialog-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
}
</style>
