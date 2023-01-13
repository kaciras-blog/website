<template>
	<PageMeta title='技术栈'/>

	<section class='about-section'>
		<IconSectionHeader
			icon='@/assets/img/logo-kaciras.png'
			title="Kaciras' Blog"
		/>
		<IconParagraph
			src='@/assets/img/logo-github.svg'
			title='github'
		>
			<a class='highlight' href='https://github.com/kaciras-blog'>
				https://github.com/kaciras-blog
			</a>
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/html-code.svg'
			title='browsers'
		>
			兼容性：
		</IconParagraph>

		<!-- ul 不能是 p 的子元素，所以拿出来了 -->
		<ul>
			<li v-for='line of browserslist' :key='line'>{{ line }}</li>
		</ul>
	</section>

	<section class='about-section'>
		<IconSectionHeader
			title='网页客户端'
			icon='@/assets/img/website.svg'
		/>
		<IconParagraph
			src='@/assets/img/logo-vue.svg'
			title='vue'
		>
			网页端是用 Vue3 全家桶编写的单页应用，手撸组件和 CSS。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/tools-and-utensils.svg'
			title='write'
		>
			拥有 Markdown 编辑器，支持动图、视频等。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/logo-sentry.png'
			title='sentry'
		>
			由 Sentry.io 提供的的免费服务来监控页面里发生的错误。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/vite.svg'
			title='Vite'
		>
			使用 Vite 打包代码和资源，并提供开发时的热重载。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/logo-pwa.png'
			title='pwa'
		>
			支持 PWA，大幅提升了加载速度，使用自己实现的 ServiceWorker。
		</IconParagraph>
	</section>

	<section class='about-section'>
		<IconSectionHeader
			title='页面服务器'
			icon='@/assets/img/web-server.svg'
		/>
		<IconParagraph
			src='@/assets/img/logo-nodejs.svg'
			title='nodejs'
		>
			页面服务使用 NodeJS 编写，使用了 Koa 全家桶。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/browser-gears.svg'
			title='ssr'
		>
			支持服务端渲染，让网站能够被搜索引擎抓取，并减少首次访问的白屏时间。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/photo.svg'
			title='webp'
		>
			支持图片自动优化、转码，节约了 93.5% 的流量
			（根据文章里的图片计算，假定支持 AVIF）。
		</IconParagraph>
	</section>

	<section class='about-section'>
		<IconSectionHeader
			title='内容服务器'
			icon='@/assets/img/data-server.svg'
		/>
		<IconParagraph
			src='@/assets/img/logo-spring-framework.svg'
			title='spring framework'
		>
			内容服务以 JAVA 语言为主，使用 Spring 全家桶。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/logo-redis.svg'
			title='redis'
		>
			由 Redis 提供高性能的会话、缓存、友链、通知等数据的存储。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/logo-mariadb.png'
			title='mariadb'
		>
			文章、评论、分类、用户等数据存储在 MariaDB 数据库中。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/icons8-nginx.svg'
			title='nginx'
		>
			使用 NGINX 做反向代理，统一访问入口。
		</IconParagraph>
		<IconParagraph
			src='@/assets/img/debian.png'
			title='debian'
		>
			本站运行于 Debian 系统上，使用 testing 分支滚动更新。
		</IconParagraph>
	</section>
</template>

<script setup lang="ts">
// noinspection ES6UnusedImports WebStorm 的分析有问题。
import { browserslist } from "../../../package.json";

import IconSectionHeader from "@/components/IconSectionHeader.vue";
import IconParagraph from "@/components/IconParagraph.vue";
import PageMeta from "@/components/PageMeta";</script>
