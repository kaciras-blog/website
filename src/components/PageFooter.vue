<!--suppress HtmlUnknownTarget -->
<template v-once>
	<footer :class='$style.globalFooter'>
		<div :class='$style.info'>
			<p>&copy; Kaciras 2018-{{ new Date().getFullYear() }}</p>
			<address>Kaciras@protonmail.com</address>
		</div>
		<RouterLink class='highlight pink' to='/'>首页</RouterLink>
		<a class='highlight pink' href='/sitemap.xml'>站点地图</a>
	</footer>
</template>

<style module lang="less">
@import "../css/imports";

.globalFooter {
	width: 100%;
	color: #eee;
	background-color: #303030;
	padding: 20px;

	display: grid;
	gap: 1rem;
	grid-template-columns: 1fr 1fr;
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 20px 5%;
		justify-items: start;
		grid-template-columns: 1fr;
		grid-auto-flow: column;
	}
}

.info {
	@media screen and (max-width: @length-screen-mobile) {
		grid-column-start: 1;
		grid-column-end: 3;
		text-align: center;
	}
}
</style>
