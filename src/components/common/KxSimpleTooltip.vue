<template>
	<pre class="kx-simple-tooltip">
		测试消息
	</pre>
</template>

<script>
export default {
	name: "KxSimpleTooltip",
};
</script>

<style lang="less">
.kx-simple-tooltip {
	position: absolute;
	padding: .4rem;

	color: white;
	background-color: black;

	&::before {
		content: "";
		position: absolute;

		border: solid transparent .5rem;
		border-bottom-color: black;
	}
}
</style>
