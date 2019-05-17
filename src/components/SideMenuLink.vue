<template functional>
	<router-link :to="props.to" :class="$style.link" class="clean-link">
		<i :class="props.icon"></i>&nbsp;<slot/>
	</router-link>
</template>

<style module lang="less">
.link {
	display: block;
	padding: 12px 25px;

	&:hover, &:focus {
		background-color: hsla(320, 100%, 50%, .05);
	}
}
</style>
