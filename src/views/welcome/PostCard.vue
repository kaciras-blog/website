<template functional>
	<li :class="$style.card">
		<router-link :to="props.link">
			<img :src="props.picture" alt="封面" :class="$style.image">
			<h2>{{props.name}}</h2>
		</router-link>
	</li>
</template>

<style module lang="less">
@import "../../css/Imports";

.card {
	list-style: none;
	border: solid 1px @color-border;
	border-radius: 8px;
	overflow: hidden;
}

.image {
	width: 250px;
	height: 200px;
}
</style>
