<!--suppress HtmlUnknownTarget -->
<template functional v-once>
	<footer id="bottom-footer">
		<div :class="$style.info">
			<p>&copy; Kaciras' Blog 2018-2019</p>
			<address>Kaciras@outlook.com</address>

			<!-- 懒得写图标版权了，反正个人网站也没人管 -->
			<!--<p></p>-->
			<!--<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by	<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>-->
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

<style module lang="less">
@import "../css/Imports.less";

:global(#bottom-footer) {
	width: 100%;
	color: #eee;
	background-color: #303030;
	padding: 20px;
	margin-top: 60px;

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

.info{
	grid-column-start: 1;
	grid-column-end: 3;
	text-align: center;

	@media screen and (min-width: @length-screen-mobile) {
		text-align: start;
		grid-column-end: 2;
	}
}
</style>
