<template functional>
	<div class="about-tab-page">

		<section class="about-section">
			<icon-section-header title="Kaciras的个人博客" icon="../../assets/img/logo-kaciras.svg"/>
			<icon-paragraph src="../../assets/img/github-logo.svg" title="github">
				网站代码开源：
				<a class="highlight" href="https://github.com/kaciras-blog">https://github.com/kaciras-blog</a>
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-tor.png" title="no-js">
				本站支持服务端渲染，能够在禁止JS的情况下浏览。
				禁用JS仅会导致首页背景无法加载，以及无法看到评论。
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/html-code.svg" title="browsers">
				兼容性（以Grid布局为基准）：
				<ul>
					<li>MicrosoftEdge 16</li>
					<li>Firefox 52</li>
					<li>Chrome 57</li>
					<li>Safari 10.3</li>
					<li>Opera 44</li>
					<li>IE 全都不支持</li>
				</ul>
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="网页客户端" icon="../../assets/img/website.svg"/>
			<icon-paragraph src="../../assets/img/logo-vue.svg" title="sentry">
				网页端是用Vue全家桶编写的单页应用，目前共有9个页面，纯手撸组件未使用UI库。
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-pwa.png" title="pwa">
				本站拥有PWA支持，大幅提升了加载速度。使用了自己写的一个ServiceWorker，主要参考了workbox项目
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-sentry.png" title="sentry">
				由Sentry提供的的免费服务来监控和统计页面里发生的异常
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-webpack.svg" title="sentry">
				使用Webpack4打包代码和资源，并提供开发时的热重载
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="页面服务器" icon="../../assets/img/web-server.svg"/>
			<icon-paragraph src="../../assets/img/logo-nodejs.svg" title="nodejs">
				页面服务器使用NodeJS编写，使用了Koa全家桶
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/browser-gears.svg" title="ssr">
				支持由Vue提供的服务端渲染功能，让网站能够被搜索引擎抓取，并减少白屏时间
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/photo.svg" title="webp">
				支持图片自动优化、压缩，转码为最新的WebP格式，节约了76.2%的流量（根据文章里的图片计算）
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="内容服务器" icon="../../assets/img/data-server.svg"/>
			<icon-paragraph src="../../assets/img/logo-spring-framework.svg" title="spring framework">
				内容服务器以JAVA语言为主，使用Spring全家桶
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-redis.svg" title="redis">
				由Redis提供高性能的会话、缓存、访问记录等数据的存储
			</icon-paragraph>
			<icon-paragraph src="../../assets/img/logo-mariadb.png" title="mariadb">
				文章、评论、分类、用户等数据存储在Mariadb数据库中
			</icon-paragraph>
		</section>
	</div>
</template>
