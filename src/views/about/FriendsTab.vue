<template>
	<PageMeta title='友链'/>

	<section id='friend' class='about-section'>
		<h1>友情链接</h1>
		<img alt='example' src='@/assets/img/friend-example.png' :class='$style.example'>
		<p>
			加友链在下面评论即可，填写以下几项：
		</p>
		<ul>
			<li>网站地址（必需）。</li>
			<li>名字，如果没有则使用您网站的标题。</li>
			<li>背景，16：9 的图片，如果没有则使用您首页的截图。</li>
			<li>图标，如果没有则使用您网站的图标或 GitHub 头像。</li>
		</ul>

		<h2>本站信息</h2>
		<dl class='grid-dl'>
			<dt>地址</dt>
			<dd>
				<a class='highlight' href='https://blog.kaciras.com'>https://blog.kaciras.com</a>
			</dd>
			<dt>名字</dt>
			<dd>Kaciras Blog</dd>
			<dt>图标</dt>
			<dd>
				<a :class='$style.inlineLink' href='/favicon-bg.png'>favicon-bg.png</a>
			</dd>
			<dt>描述</dt>
			<dd>编程 • 生活 • 梦想</dd>
		</dl>

		<h2>其它说明</h2>
		<p>您的站点地址必须使用 HTTPS。</p>
		<p>原则上只加计算机和 ACG 内容相关，并且是原创内容的站点，友链最好能互加。</p>
		<p>本站会自动清理超过一个月无法访问的链接。</p>
	</section>

	<!--
		因为 Vue 的 provide 不是响应式的，一旦复用则编辑器的 inject 无法更新。
		这里设置 key=<object-id> 强制页面切换时重新创建组件。
	-->
	<DiscussionSection
		:type='2'
		:object-id='2'
		:key='2'
		class='about-section'
		:class='$style.discussion'
	/>
</template>

<script setup lang="ts">
import DiscussionSection from "@/components/discussion/DiscussionSection.vue";
import PageMeta from "@/components/PageMeta";</script>

<style module lang="less">
.example {
	display: block;
	width: 330px;
	aspect-ratio: 660 / 346;
	max-width: 100%;
	margin: 0 auto 1em auto;
}

.inlineLink {
	composes: highlight from global;
	margin-right: .5em;
}

.discussion {
	font-size: 14px; // 这里还得改回来...
}
</style>
