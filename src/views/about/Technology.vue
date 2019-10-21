<!-- 函数式组件里不能局部注册组件，注册了也引用不到 -->
<template>
	<div class="about-tab-page">
		<section class="about-section">
			<icon-section-header title="网页客户端" :icon="require('../../assets/img/website.svg')"/>
			<icon-paragraph :src="require('../../assets/img/html-code.svg')" title="browsers">
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
			<icon-paragraph :src="require('../../assets/img/logo-vue.svg')" title="sentry">
				网页端是用Vue全家桶编写的单页应用，目前共有11个页面
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-pwa.png')" title="pwa">
				本站拥有PWA支持，大幅提升了加载速度。使用了自己写的一个简单的ServiceWorker框架，主要参考了workbox项目
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-sentry.png')" title="sentry">
				由Sentry提供的的免费服务来监控和统计页面里发生的异常
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-webpack.svg')" title="sentry">
				使用Webpack4打包代码和资源，并提供开发时的热重载
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="页面服务器" :icon="require('../../assets/img/web-server.svg')"/>
			<icon-paragraph :src="require('../../assets/img/logo-nodejs.svg')" title="nodejs">
				页面服务器使用NodeJS编写，使用了Koa全家桶
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/browser-gears.svg')" title="ssr">
				支持由Vue提供的服务端渲染功能，让网站能够被搜索引擎抓取，并减少白屏时间
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="内容服务器" :icon="require('../../assets/img/data-server.svg')"/>
			<icon-paragraph :src="require('../../assets/img/logo-spring-framework.svg')" title="spring framework">
				内容服务器以JAVA语言为主，使用Spring全家桶
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-redis.svg')" title="redis">
				由Redis提供高性能的会话、缓存、访问记录等数据的存储
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-mariadb.png')" title="mariadb">
				文章、评论、分类、用户等数据存储在Mariadb数据库中
			</icon-paragraph>
		</section>
	</div>
</template>

<script>
import IconParagraph from "./IconParagraph";
import IconSectionHeader from "./IconSectionHeader";

export default {
	components: { IconSectionHeader, IconParagraph },
};
</script>
