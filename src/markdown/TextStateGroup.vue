<template>
	<div class="el-wrapper">
		<span v-if="selected" :class="$style.item">
			选择：{{selection[0] + " - " + selection[1]}}：{{selection[1] - selection[0]}} 字
		</span>
		<span :class="$style.item">
			总字数：{{text.length}}
		</span>
	</div>
</template>

<script>
export default {
	name: "TextStateGroup",
	props: {
		text: {
			type: String,
			required: true,
		},
		selection: {
			type: Array,
			required: true,
		},
	},
	computed: {
		selected() {
			return this.selection[0] !== this.selection[1];
		},
	},
};
</script>

<style module lang="less">
.item {
	margin: 0 .5em;
}
</style>
