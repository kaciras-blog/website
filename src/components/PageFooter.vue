<!--suppress HtmlUnknownTarget -->
<template functional v-once>
	<footer id="bottom-footer">
		<div class="address">
			<p>Copyright &copy; 2017-2018 Kaciras.net All Rights Reserved.</p>
			<address>Kaciras@outlook.com</address>
		</div>
		<div>
			<router-link class="highlight pink" to="/">首页</router-link>
		</div>
		<div>
			<a class="highlight pink" href="/sitemap.xml">站点地图</a>
		</div>
	</footer>
</template>

<script>
export default {
	name: "PageFooter",
};
</script>

<style lang="less">
@import "../css/ToBeImport.less";

#bottom-footer {
	width: 100%;
	margin-top: 4rem;
	color: #eee;
	background-color: #303030;
	padding: 1rem;

	display: grid;
	grid-gap: 1rem;
	grid-template-columns: 1fr 1fr;
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 1rem 5%;
		grid-template-rows: auto;
		grid-template-columns: 1fr auto auto;
		justify-items: start;
	}

	& > .address {
		grid-column-start: 1;
		grid-column-end: 3;
		text-align: center;

		@media screen and (min-width: @length-screen-mobile) {
			text-align: start;
			grid-column-end: 2;
		}
	}
}
</style>
