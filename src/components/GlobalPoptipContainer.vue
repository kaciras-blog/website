<!-- TODO: 跟弹窗栈很像，能否合并 -->
<template>
	<div :class="$style.container">
		<transition
			name="remix"
			v-for="v of stack"
			:key="v.randomId">

			<component
				:is="v.component"
				:class="$style.poptipDefault"
				v-bind="v.props"
				v-on="v.listeners"/>
		</transition>
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
			return randomId;
		},
		close(id) {
			deleteOn(this.stack, item => item.randomId === id);
		},
		setState(id, props) {
			const i = this.stack.findIndex(item => item.randomId === id);
			this.stack[i].props = props;
		},
	},
};
</script>

<style module lang="less">
@import "../css/Imports";

.container {
	position: fixed;
	right: 10px;
	bottom: 0;

	display: flex;
	flex-direction: column-reverse;
}

.poptipDefault {
	margin-bottom: 10px;
	padding: 8px 12px;
	border-radius: 5px;
	background-color: #222;
	color: white;
}
</style>

<!-- TODO: 进入过度无效？ -->
<style>
.remix-leave-to, .remix-enter {
	opacity: 0;
	transform: translateX(20px);
}
.remix-enter-to {
	opacity: 1;
	transform: none;
}
.remix-leave-active, .remix-enter-active {
	transition: all ease .3s;
}
</style>
