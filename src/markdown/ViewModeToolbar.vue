<template>
	<kx-button class="info" title="双列视图" icon="fas fa-columns" @click="splitMode"/>
	<kx-button class="info" title="Markdown视图" icon="far fa-edit" @click="markdownMode"/>
	<kx-button class="info" title="Html视图" icon="fas fa-eye" @click="htmlMode"/>
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

