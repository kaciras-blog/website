<template functional>
	<div class="about-tab-page">
		<section class="about-section">
			<icon-section-header title="Kaciras的个人博客" icon="@assets/img/logo-kaciras.svg"/>
			<icon-paragraph src="@assets/img/logo-github.svg" title="github">
				网站源码：
				<a class="highlight" href="https://github.com/kaciras-blog">https://github.com/kaciras-blog</a>
			</icon-paragraph>
			<icon-paragraph src="@assets/img/html-code.svg" title="browsers">
				兼容性：
				<ul>
					<li>MicrosoftEdge 79</li>
					<li>Firefox 57</li>
					<li>Chrome 66</li>
					<li>Safari 12.1</li>
					<li>IOS 11.3</li>
					<li>Opera 53</li>
					<li>IE 全都不支持</li>
				</ul>
			</icon-paragraph>
			<p>本站的服务器位于美国，中国的访问者可能有较高（200ms左右）的延迟</p>
		</section>

		<section class="about-section">
			<icon-section-header title="网页客户端" icon="@assets/img/website.svg"/>
			<icon-paragraph src="@assets/img/logo-vue.svg" title="vue">
				网页端是用 Vue 全家桶编写的单页应用，目前共有9个页面，纯手撸组件未使用UI库。
			</icon-paragraph>
			<icon-paragraph src="@assets/img/tools-and-utensils.svg" title="write">
				拥有 Markdown 编辑器，支持图片、视频、LaTeX等。
			</icon-paragraph>
			<icon-paragraph src="@assets/img/logo-sentry.png" title="sentry">
				由 Sentry.io 提供的的免费服务来监控和统计页面里发生的错误。
			</icon-paragraph>
			<icon-paragraph src="@assets/img/logo-webpack.svg" title="webpack">
				使用 Webpack 打包代码和资源，并提供开发时的热重载。
			</icon-paragraph>
			<icon-paragraph src="@assets/img/logo-pwa.png" title="pwa">
				本站拥有PWA支持，大幅提升了加载速度（不过服务器在国外也快不到哪去），
				使用了自己写的一个ServiceWorker，主要参考了 workbox 项目。
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="页面服务器" icon="@assets/img/web-server.svg"/>
			<icon-paragraph src="@assets/img/logo-nodejs.svg" title="nodejs">
				页面服务器使用NodeJS编写，使用了Koa全家桶
			</icon-paragraph>
			<icon-paragraph src="@assets/img/browser-gears.svg" title="ssr">
				支持由Vue提供的服务端渲染功能，让网站能够被搜索引擎抓取，并减少首次访问的白屏时间
			</icon-paragraph>
			<icon-paragraph src="@assets/img/photo.svg" title="webp">
				支持图片自动优化、压缩，转码为最新的WebP格式，节约了76.2%的流量（根据文章里的图片计算）
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="内容服务器" icon="@assets/img/data-server.svg"/>
			<icon-paragraph src="@assets/img/logo-spring-framework.svg" title="spring framework">
				内容服务器以 JAVA 语言为主，使用 Spring 全家桶
			</icon-paragraph>
			<icon-paragraph src="@assets/img/logo-redis.svg" title="redis">
				由 Redis 提供高性能的会话、缓存、友链、通知等数据的存储
			</icon-paragraph>
			<icon-paragraph src="@assets/img/logo-mariadb.png" title="mariadb">
				文章、评论、分类、用户等数据存储在 Mariadb 数据库中
			</icon-paragraph>
			<icon-paragraph src="@assets/img/icons8-nginx.svg" title="nginx">
				使用NGINX做反向代理，统一访问入口
			</icon-paragraph>
			<icon-paragraph src="@assets/img/debian.png" title="debian">
				本网站运行于 Debian Buster 系统上，使用 testing 分支滚动更新
			</icon-paragraph>
		</section>
	</div>
</template>
