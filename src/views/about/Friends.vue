<template>
	<div class="about-tab-page">
		<section id="friend" class="about-section">
			<h1>友情链接</h1>
			<img alt="example" src="@/assets/img/friend-example.png" :class="$style.example">
			<p>
				加友链在下面评论即可，填写以下几项：
			</p>
			<ul>
				<li>网站地址（必需）</li>
				<li>名字，如果没有则使用您网站的标题</li>
				<li>背景，16：9 的图片，如果没有则使用您首页的截图</li>
				<li>图标，如果没有则使用您网站的图标或GitHub头像</li>
			</ul>

			<h2>本站信息</h2>
			<p>
				网站地址：
				<a class="highlight" href="https://blog.kaciras.com">https://blog.kaciras.com</a>
			</p>

			<!-- 有些地方可能直接引用这个链接，所以要保证URL不变，并能在任意位置访问。-->
			<p>
				图标：
				<a :class="$style.inlineLink" href='/avatar.png'>avatar.png</a>
			</p>
			<p>名字：Kaciras</p>
			<p>描述：编程 • 生活 • 梦想</p>

			<h2>其它说明</h2>
			<p>您的站点必须启用 HTTPS。</p>
			<p>原则上只加计算机和 ACG 内容相关，并且是原创内容的站点，友链最好能互加。</p>
			<p>本站会自动清理超过一个月无法访问的链接。</p>

			<h2>关于互动</h2>
			<p>全部友链我都会看的，如果支持 RSS 就更好了，我会第一时间围观 ヽ(✿ﾟ▽ﾟ)ノ</p>
			<p>友情也是需要精心维护的哦 ♪(^∇^*)</p>
		</section>

		<!--
			因为 Vue 的 provide 不是响应式的，一旦复用则编辑器的 inject 无法更新。
			这里设置 key=<object-id> 强制页面切换时重新创建组件。
		-->
		<discussion-section
			:type="2"
			:object-id="2"
			:key="2"
			class="about-section"
			:class="$style.discussion"
		/>
	</div>
</template>

<script setup lang="ts">
import DiscussionSection from "@/components/discussion/DiscussionSection.vue";</script>

<style module lang="less">
.example {
	display: block;
	width: 380px;
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
