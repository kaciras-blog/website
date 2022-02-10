<template>
	<li
		:class="$style.container"
		tabindex="0"
		@click="emit('click')"
		@keyup.enter="emit('click')"
	>
		<img
			:src="cover ?? DEFAULT_CODER"
			alt="分类图标"
			:class="$style.cover"
		>
		<span :class="$style.name">
			{{ name }}
		</span>
	</li>
</template>

<script setup lang="ts">
import DEFAULT_CODER from "@/assets/img/category.png";

// defineProps 目前不支持外部导入的类型，只能先写死了。
// https://github.com/vuejs/core/issues/4294
defineProps(["cover", "name"]);
defineEmits(["click"]);
</script>

<style module lang="less">
@import "../css/imports";

.container {
	display: inline-block;
	margin: 1rem;
	padding: 1rem;
	max-width: 9rem;

	cursor: pointer;

	text-align: center;

	&:hover, &:focus {
		outline: none;
		border-color: transparent;
		box-shadow: 0 0 4px 3px #97dfff;
	}
}

.cover {
	display: inline-block;
	margin: 0 1rem 1rem;
	.size(5rem);
	border-radius: 1rem;
}

.name {
	display: block;
	height: 2.5em;
	line-height: 1.25em;

	color: black;
	word-wrap: break-word;
	word-break: keep-all;
	overflow: hidden;
	text-overflow: ellipsis;

}
</style>
