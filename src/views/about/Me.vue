<!-- /about/me 更具通用性，比用自己名字做 url 更好，况且名字还可能变 -->
<template>
	<div class="about-tab-page">
		<section class="about-section">
			<div :class="$style.profile">
				<img
					src="/static/img/avatar.png"
					alt="logo"
					class="large head"
				>
				<h1 :class="$style.name">Kaciras</h1>
				<p>自学码农 / 热爱技术 / 全栈开发 / 二刺螈 / 啥都想学</p>

				<p :class="$style.socialLinks">
					<social-link
						href="mailto:Kaciras@protonmail.com"
						name="Email"
						icon="@/assets/img/email.svg"
					/>
					<social-link
						href="https://github.com/Kaciras"
						name="GitHub"
						icon="@/assets/img/logo-github.svg"
					/>
					<social-link
						href="https://matrix.to/#/@kaciras:matrix.org"
						name="Matrix"
						icon="@/assets/img/element-io.svg"
					/>
				</p>
			</div>

			<h2>名字和头像</h2>
			<p>
				Kaciras这个名字，是我初中玩网游时滚键盘打出来的，没有意义，我也不知道咋读。
				后来在需要英文名的地方都用它，索性就一直用下去了。
			</p>
			<p>
				头像是盗别人的，感觉挺不错就用了，应该没人同时认识我和原作者所以不用担心撞脸……
				不过以后还是自己做一个图好些，等我学画画先……
			</p>
		</section>

		<discussion-section
			:type="2"
			:object-id="1"
			:key="1"
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
	&[title="Email"] { --color: rgba(0, 217, 184, .6); }

	&[title="GitHub"] { --color: rgba(0, 0, 0, .25); }

	&[title="Matrix"] { --color: rgba(247, 227, 0, 0.65); }
}

.discussion {
	font-size: 14px; // 这里还得改回来...
}
</style>
