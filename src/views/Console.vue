<template>
<div id="app" class="flex compact">
	<aside id="tabs" class="flex vertical compact">
		<h2>控制台</h2>
		<router-link class="tabItem" to="/console/article">文章列表</router-link>
		<router-link class="tabItem" to="/console/draft">我的草稿</router-link>
		<router-link class="tabItem" to="/console/category">管理分类</router-link>
		<router-link class="tabItem" to="/console/config">选项</router-link>
		<router-link class="tabItem" to="/console/overview">访问统计</router-link>
		<router-link class="tabItem" to="/console/misc">其他功能</router-link>
	</aside>

	<div class="flex vertical expansion">
		<nav id="navBar" class="flex center-agign reserve">
			<router-link to="/" class="block">返回首页</router-link>
		</nav>
		<div class="content-body">
			<router-view></router-view>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "Console",
};
</script>

<style scoped lang="less">
.content-body {
	overflow-y: auto;
}

.content-body > * {
	margin: 2rem;
}

#app{
	height: 100%;
}
.router-link-active::after{
	content: "";
	position: absolute;
	top: 50%;
	right: 0;
	margin-top: -.8rem;

	width: 0;
	height: 0;
	border: .8rem solid transparent;
	border-right-color: #FCFCFC;
}
#tabs {
	width: 200px;
	background-color: #1f2126;
	height: 100%;
	color: #dfdfdf;
	text-align: center;
	z-index: 2; // 盖住导航栏的阴影
}
.tabItem {
	display: block;
	font-size: 1rem;
	cursor: pointer;
	background-color: transparent;
	border: none;
	padding: .6rem;
	color: #dfdfdf;
	transform: rotateZ(0);
}

.tabItem:hover {
	color: #83daef;
	background-color: rgba(255, 255, 255, 0.06);
}
</style>
