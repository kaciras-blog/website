<!--suppress HtmlUnknownTarget -->
<template v-once>
	<footer :class='$style.globalFooter'>
		<div :class='$style.info'>
			<p>&copy; Kaciras 2018-2022</p>
			<address>Kaciras@protonmail.com</address>
		</div>
		<div>
			<RouterLink class='highlight pink' to='/'>首页</RouterLink>
		</div>
		<div>
			<a class='highlight pink' href='/sitemap.xml'>站点地图</a>
		</div>
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
	grid-gap: 1rem;
	grid-template-columns: 1fr 1fr;
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 20px 5%;
		grid-template-rows: auto;
		grid-template-columns: 1fr auto auto;
		justify-items: start;
	}
}

.info {
	grid-column-start: 1;
	grid-column-end: 3;
	text-align: center;

	@media screen and (min-width: @length-screen-mobile) {
		text-align: start;
		grid-column-end: 2;
	}
}
</style>
