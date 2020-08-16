<template functional>
	<div class="about-tab-page">

		<section class="about-section">
			<div :class="$style.profile">
				<!-- 本人帅气的头像绝不能压缩 -->
				<img
					src="/static/img/avatar.png"
					alt="logo"
					class="head"
				>
				<div>
					<h2>Kaciras</h2>
					<address>Kaciras@protonmail.com</address>
				</div>
			</div>
			<p>
				GitHub: <a class="highlight" href="https://github.com/Kaciras">https://github.com/Kaciras</a>
			</p>
			<ul class="clean-list" :class="$style.tag_list">
				<li>自学码农</li>
				<li>热爱技术</li>
				<li>全栈开发</li>
				<li>冻鳗</li>
				<li>二刺螈</li>
				<li>啥都想学</li>
			</ul>
		</section>

		<section id="friend" class="about-section">
			<h2>友情链接</h2>
			<img alt="example" src="../../assets/img/friend-example.png" :class="$style.example">
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
			<p>
				图标：
				<a :class="$style.inlineLink" href='/static/img/avatar.png'>avatar.png</a>
			</p>
			<p>名字：Kaciras' Blog 或 Kaciras的博客</p>
			<p>描述：编程 • 生活 • 梦想</p>
		</section>

		<discussion-section
			:object-id="0"
			:type="1"
			class="about-section"
			:class="$style.discussion"
		/>
	</div>
</template>

<style module lang="less">
.profile {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 20px;
	margin-bottom: 1rem;
}

.tag_list {
	display: flex;
	flex-wrap: wrap;
	line-height: 1.5;

	& > li:not(:first-child)::before {
		content: "/";
		padding: 0 5px;
	}
}

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
