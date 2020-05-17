<template functional>
	<li
		:class="$style.container"
		tabindex="0"
		@click="listeners.click"
		@keyup.enter="listeners.click"
	>
		<img
			:src="props.cover"
			alt="分类图标"
			:class="$style.cover"
		>
		<span :class="$style.name">{{props.name}}</span>
	</li>
</template>

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
