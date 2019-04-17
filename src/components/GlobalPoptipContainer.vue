<!-- TODO: 跟弹窗栈很像，能否合并 -->
<template>
	<div v-if="stack.length" :class="$style.container">
		<component
			v-for="v of stack"
			:is="v.component"
			:key="v.randomId"
			v-bind="v.props"
			v-on="v.listeners"/>
	</div>
</template>

<script>
import { deleteOn } from "../utils";

export default {
	name: "GlobalPoptipContainer",
	data: () => ({
		stack: [],
	}),
	methods: {
		add(component, props, listeners) {
			const randomId = Math.random();
			this.stack.push({ randomId, component, props, listeners });
			return () => deleteOn(this.stack, item => item.randomId === randomId);
		},
	},
};
</script>

<style module lang="less">
@import "../css/Imports";

.container {
	position: fixed;
	right: 10px;
	bottom: 10px;

	display: flex;
	flex-direction: column-reverse;
}
</style>
