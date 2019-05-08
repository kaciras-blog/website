<template functional>
	<header :class="$style.section_header">
		<h2>{{props.title}}</h2>
		<img :src="props.icon" alt="header icon" :class="$style.section_icon">
	</header>
</template>

<script>
export default {
	name: "IconSectionHeader",
};
</script>

<style module lang="less">
@import "../../css/Imports";

.section_header {
	position: relative;
}

.section_icon {
	position: absolute;
	top: 0;
	right: 0;
	.size(100px);
}
</style>
