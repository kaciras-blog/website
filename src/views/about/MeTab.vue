<!-- /about/me 更具通用性，比用自己名字做 url 更好，况且名字还可能变 -->
<template>
	<PageMeta title='博主'/>

	<section class='about-section'>
		<div :class='$style.profile'>
			<img
				src='/avatar.png'
				alt='logo'
				class='large head'
			>
			<h1 :class='$style.name'>Kaciras</h1>
			<p>自学码农 / 热爱技术 / 全栈开发 / 二刺螈 / 啥都想学</p>

			<p :class='$style.socialLinks'>
				<SocialLink
					href='mailto:Kaciras@outlook.com'
					name='Email'
					icon='@/assets/img/email.svg'
				/>
				<SocialLink
					href='https://github.com/Kaciras'
					name='GitHub'
					icon='@/assets/img/logo-github.svg'
				/>
				<SocialLink
					href='https://www.zhihu.com/people/kaciras'
					name='ZhiHu'
					icon='@/assets/img/zhihu.png'
				/>
				<SocialLink
					href='https://matrix.to/#/@kaciras:matrix.org'
					name='Matrix'
					icon='@/assets/img/element-io.svg'
				/>
			</p>
		</div>

		<h2>名字</h2>
		<p>
			Kaciras 是我初中玩网游时滚键盘打出来的，没有意义，我也不知道咋读。
			后来在需要英文名的地方都用它，索性就一直用下去了。
		</p>
	</section>

	<DiscussionSection
		:type='2'
		:object-id='1'
		:key='1'
		:class='$style.discussion'
	/>
</template>

<script setup lang="ts">
import SocialLink from "@/components/SocialLink.vue";
import PageMeta from "@/components/PageMeta.ts";
import DiscussionSection from "@/components/discussion/DiscussionSection.vue";
</script>

<style module lang="less">
@import "../../css/imports.less";

.profile {
	text-align: center;
	margin-bottom: 1rem;
}

@media screen and (min-width: @length-screen-mobile) {
	.name {
		margin: revert;
	}
}

.socialLinks > a {
	&[title="Email"] { --color: rgba(0, 217, 170, 0.5); }

	&[title="GitHub"] { --color: rgba(0, 0, 0, .25); }

	&[title="Matrix"] { --color: rgba(242, 222, 0, 0.65); }

	&[title="ZhiHu"] { --color: rgba(31, 147, 255, 0.5); }
}

.discussion {
	composes: about-section from global;
	font-size: 14px; // 这里还得改回来...
}
</style>
