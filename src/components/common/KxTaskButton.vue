<template>
	<kx-button :tag="tag"
			   :class="{ running }"
			   :type="type"
			   :color="color"
			   @click="handleClick">

		<slot v-if="running" name="running">
			<slot/>
		</slot>
		<slot v-else/>
	</kx-button>
</template>

<script>
import KxButton from "./KxButton";

export default {
	name: "KxTaskButton",
	components: { KxButton },
	props: {
		onClick: {
			type: Function,
			required: true,
		},
		// 直接代理到下层按钮组件
		type: String,
		tag: String,
		color: String,
	},
	data: () => ({
		running: false,
	}),
	methods: {
		handleClick() {
			const task = this.onClick();
			if (task) {
				this.running = true;
				task.then(() => this.running = false);
			}
		},
	},
};
</script>
