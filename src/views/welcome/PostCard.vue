<template functional>
	<li :class="$style.card">
		<router-link :to="item.link">
			<img :src="item.picture" alt="封面" :class="$style.image">
			<h2>{{item.name}}</h2>
		</router-link>
	</li>
</template>

<script>
export default {
	name: "PostCard",
	props: ["item"],
};
</script>

<style module lang="less">
@import "../../css/Imports";

.card {
	list-style: none;
	border: solid 1px @color-border;
}

.image {
	width: 250px;
	height: 200px;
}
</style>
