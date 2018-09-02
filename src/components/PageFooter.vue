<template>
	<footer id="bottom-footer">
		<div class="bft-text">
			<p>Copyright &copy; 2017-2018 Kaciras.net All Rights Reserved.</p>
			<address>Kaciras@outlook.com</address>
		</div>
		<div class="bft-links">
			<router-link class="link" to="/">首页</router-link>
			<a class="link" href="/sitemap.xml">站点地图</a>
		</div>
	</footer>
</template>

<script>
export default {
	name: "PageFooter",
};
</script>

<style lang="less">
@import "../css/ToBeImpoert.less";

#bottom-footer {
	width: 100%;
	margin-top: 4rem;
	color: #eee;
	background-color: #303030;
	padding: 1rem;

	display: flex;
	flex-direction: column;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 1rem 5%;
		flex-direction: row;
		justify-content: space-between;
	}
}
</style>
