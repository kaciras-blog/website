<template>
	<header :class='$style.header'>
		<h1 class='compact'>
			{{ title }}
		</h1>
		<img
			alt='header icon'
			:src='icon'
			:class='$style.icon'
		>
	</header>
</template>

<script setup lang="ts">
interface IconSectionHeaderProps {
	icon: string;
	title: string;
}

defineProps<IconSectionHeaderProps>();
</script>

<style module lang="less">
@import "../css/imports";

.header {
	display: flex;
	align-items: center;
	margin-bottom: 1em;

	@media screen and (max-width: @length-screen-mobile) {
		margin-top: -5px;
	}
}

.icon {
	.size(80px);
	margin-left: auto;
}
</style>
