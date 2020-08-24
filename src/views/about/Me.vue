<!-- /about/me 更具通用性，必用自己名字做url更好，而且名字还可能变 -->
<template functional>
	<div class="about-tab-page">

		<section class="about-section">
			<div :class="$style.profile">
				<img
					src="/static/img/avatar.png"
					alt="logo"
					class="head"
				>

				<h1 :class="$style.name">Kaciras</h1>
				<p>自学码农 / 热爱技术 / 全栈开发 / 冻鳗 / 二刺螈 / 啥都想学</p>

				<p :class="$style.socialLinks">
					<social-link
						href="mailto:Kaciras@protonmail.com"
						name="Email"
						icon="@assets/img/email.svg"
					/>
					<social-link
						href="https://github.com/Kaciras"
						name="GitHub"
						icon="@assets/img/logo-github.svg"
					/>
				</p>
			</div>

			<h2>名字和头像</h2>
			<p>
				Kaciras这个名字，是我初中玩网游时滚键盘打出来的，没有意义，我也不知道咋读。
				后来在需要英文名的地方都用它，索性就一直用下去了。
			</p>
			<p>
				头像是网上看到的，感觉挺不错就用了，原作者应该不会认识我所以不用担心撞车……
				不过以后还是自己做一个图好些，等我学画画……
			</p>
		</section>

		<section id="friend" class="about-section">
			<h1>友情链接</h1>
			<img alt="example" src="@assets/img/friend-example.png" :class="$style.example">
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

			<!-- 有些地方可能直接引用这个链接，所以要保证图标的URL不变，并且能在任意位置访问。-->
			<p>
				图标：
				<a :class="$style.inlineLink" href='/static/img/avatar.png'>avatar.png</a>
			</p>
			<p>名字：Kaciras 或 Kaciras的博客</p>
			<p>描述：编程 • 生活 • 梦想</p>

			<h2>其它说明</h2>
			<p>原则上只加计算机和ACG内容相关，并且是原创内容的站点。</p>
			<p>友链最好能互加，本站会自动清理超过一个月无法访问的链接。</p>
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
	text-align: center;
	margin-bottom: 1rem;
}

.name {
	margin: revert;
}

.socialLinks > a {
	&[title="Email"] { --color: rgba(0, 217, 184, .7); }

	&[title="GitHub"] { --color: rgba(127, 0, 224, .4); }
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
