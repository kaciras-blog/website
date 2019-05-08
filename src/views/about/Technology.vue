<template functional>
	<div :class="$style.container">
		<h1>博客网站开发相关</h1>
		<section>
			<h2>网页客户端</h2>
			<div>
				兼容性：
				<ul>
					<li>MicrosoftEdge 16</li>
					<li>Firefox 52</li>
					<li>Chrome 57</li>
					<li>Safari 10.3</li>
					<li>Opera 44</li>
					<li>IE 全部不支持</li>
				</ul>
			</div>
			<p>使用了Vue全家桶，未使用更进一步的UI框架和组件库</p>
			<p>拥有PWA支持，使用了自己写的一个简单的ServiceWorker框架，主要参考了workbox项目</p>
			<p>使用Sentry的免费服务来监控并统计页面里发生的异常</p>
		</section>
		<section>
			<h2>博客架构</h2>
			<p>Spring全家桶</p>
		</section>
	</div>
</template>

<style module lang="less">
.container {
	font-size: initial;
}
</style>
