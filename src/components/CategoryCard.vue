<template functional>
	<div :class="$style.container"
		 tabindex="0"
		 @click="listeners.click"
		 @keyup.enter="listeners.click">

		<img :src="props.cover"
			 alt="分类图标"
			 :class="$style.head">

		<h3 class="compact">{{props.name}}</h3>
	</div>
</template>

<script>
export default {
	name: "CategoryCard",
	props: { name: String, cover: String },
};
</script>

<style module lang="less">
@import "../css/ToBeImport";

.container {
	display: inline-block;
	margin: 1rem;
	padding: 0 1rem 1rem;
	max-width: 9rem;

	cursor: pointer;

	text-align: center;
	border: solid 1px #e8e8e8;

	&:hover, &:focus {
		outline: none;
		border-color: transparent;
		box-shadow: 0 0 4px 3px #97dfff;
	}
}

.head {
	display: block;
	margin: 1rem;
	.size(5rem);
	border-radius: 1rem;
}
</style>
