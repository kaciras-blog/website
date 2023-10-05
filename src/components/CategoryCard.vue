<template>
	<li
		:class='$style.container'
		tabindex='0'
		@click='$emit("click")'
		@keyup.enter='$emit("click")'
	>
		<img
			:src='cover ?? CATEGORY_IMG'
			alt='分类图标'
			:class='$style.cover'
		>
		<span :class='$style.name'>
			{{ name }}
		</span>
	</li>
</template>

<script setup lang="ts">
import { CATEGORY_IMG } from "@/common.ts";
import { Category } from "@/api/index.ts";

defineProps<Category>();
defineEmits<{ click: [] }>();
</script>

<style module lang="less">
@import "../css/imports.less";

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
