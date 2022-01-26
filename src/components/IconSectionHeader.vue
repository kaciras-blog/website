<template>
	<header :class="$style.section_header">
		<h1 class="compact">{{ title }}</h1>
		<img :src="icon" alt="header icon" :class="$style.section_icon">
	</header>
</template>

<script>
export default {
	name: "IconSectionHeader",
	props: ["title", "icon"],
};
</script>

<style module lang="less">
@import "../css/imports";

.section_header {
	display: flex;
	align-items: center;
	margin-bottom: 1em;

	@media screen and (max-width: @length-screen-mobile) {
		margin-top: -5px;
	}
}

.section_icon {
	.size(80px);
	margin-left: auto;
}
</style>
