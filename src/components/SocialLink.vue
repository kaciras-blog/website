<template>
	<a
		:title='name'
		:href='href'
		target='_blank'
		rel='noopener'
		:class='$style.container'
	>
		<img
			:src='icon'
			:alt='name'
			:class='$style.icon'
		>
	</a>
</template>

<script setup lang="ts">
interface SocialLinkProps {
	name: string;
	href: string;
	icon: string;
}

defineProps<SocialLinkProps>();
</script>

<style module lang="less">
.container {
	display: inline-block;
	margin: 0 5px;
	padding: 10px;

	border-radius: 50%;
	border: solid 4px #eee;

	transition: .3s;

	&:hover, &:focus {
		border-color: white;
		background-color: var(--color);
		box-shadow: 0 0 10px var(--color);
	}
}

.icon {
	display: block;
	width: 32px;
	height: 32px;
}
</style>
