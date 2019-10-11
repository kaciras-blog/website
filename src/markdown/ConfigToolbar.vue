<template>
	<div>
		<kx-button class="icon green" title="双列视图" @click="viewModel = 0">
			<i class="fas fa-columns"></i>
		</kx-button>
		<kx-button class="icon green" title="Markdown视图" @click="viewModel = 1">
			<i class="far fa-edit"></i>
		</kx-button>
		<kx-button class="icon green" title="Html视图" @click="viewModel = 2">
			<i class="fas fa-eye"></i>
		</kx-button>

		<kx-button class="primary icon" title="编辑器设置">
			<i class="fas fa-cog"></i>
		</kx-button>
	</div>
</template>

<script>
export default {
	name: "KxMarkdownConfigToolbar",
};
</script>
