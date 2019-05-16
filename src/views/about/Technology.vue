<!-- 函数式组件里不能局部注册组件，注册了也引用不到 -->
<template>
	<div class="about-tab-page">
		<section class="about-section">
			<icon-section-header title="网页客户端" :icon="require('../../assets/img/website.svg')"/>
			<div>
				兼容性（使用了Grid布局）：
				<ul>
					<li>MicrosoftEdge 16</li>
					<li>Firefox 52</li>
					<li>Chrome 57</li>
					<li>Safari 10.3</li>
					<li>Opera 44</li>
					<li>IE 全部不支持</li>
				</ul>
			</div>
			<icon-paragraph :src="require('../../assets/img/logo-vue.svg')" title="sentry">
				使用了Vue全家桶，未使用更进一步的UI框架和组件库
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-sentry.png')" title="pwa">
				拥有PWA支持，自己写了一个简单的ServiceWorker框架，主要参考了workbox项目
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-sentry.png')" title="sentry">
				使用Sentry的免费服务来监控和统计页面里发生的异常
			</icon-paragraph>
		</section>

		<section class="about-section">
			<icon-section-header title="页面服务器" :icon="require('../../assets/img/web-server.svg')"/>
			<icon-paragraph :src="require('../../assets/img/logo-nodejs.svg')" title="nodejs">
				页面服务器使用NodeJS编写，使用了Koa2全家桶
			</icon-paragraph>
			<p>Spring全家桶</p>
			<p>Spring全家桶</p>
		</section>

		<section class="about-section">
			<icon-section-header title="内容服务器" :icon="require('../../assets/img/data-server.svg')"/>
			<icon-paragraph :src="require('../../assets/img/logo-spring-framework.svg')" title="spring framework">
				内容服务由JAVA语言编写，使用了Spring全家桶
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-redis.svg')" title="redis">
				使用Redis提供会话、缓存等存储
			</icon-paragraph>
			<icon-paragraph :src="require('../../assets/img/logo-mariadb.png')" title="mariadb">
				使用 Mariadb 数据库存储文章、评论、分类等数据
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
