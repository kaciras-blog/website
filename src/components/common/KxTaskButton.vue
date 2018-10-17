<template>
	<kx-button
		:class="{ running }"
		:tag="tag"
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
		// 在运行状态下是否屏蔽点击事件
		waiting: {
			type: Boolean,
			default: true,
		},
		// 直接代理到下层按钮组件
		tag: String,
		icon: String,
	},
	data: () => ({
		running: false,
	}),
	methods: {
		handleClick () {
			const { running, waiting, onClick } = this;
			if (running && waiting) {
				return;
			}
			const task = onClick();
			if (task) {
				this.running = true;
				task.finally(() => this.running = false);
			}
		},
	},
};
</script>
