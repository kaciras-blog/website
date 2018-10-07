<template>
	<div>
		<kx-button class="icon green" title="双列视图" @click="splitMode">
			<i class="fas fa-columns"></i>
		</kx-button>
		<kx-button class="icon green" title="Markdown视图" @click="markdownMode">
			<i class="far fa-edit"></i>
		</kx-button>
		<kx-button class="icon green" title="Html视图" @click="htmlMode">
			<i class="fas fa-eye"></i>
		</kx-button>
	</div>
</template>

<script>
export default {
	name: "ViewModeToolbar",
	methods: {
		splitMode() {
			this.$emit("update:viewMode", 0);
		},
		markdownMode() {
			this.$emit("update:viewMode", 1);
		},
		htmlMode() {
			this.$emit("update:viewMode", 2);
		},
	},
};
</script>

