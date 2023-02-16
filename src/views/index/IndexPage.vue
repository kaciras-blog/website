<template>
	<BasePageLayout>
		<PageMeta title='首页' body-class=''/>

		<template #nav>
			<TopNav :class='$style.nav'/>
		</template>

		<section :class='$style.banner'>
			<h1 :class='$style.title'>Kaciras' Blog</h1>
			编程 • 生活 • 梦想
		</section>

		<BlogSection :class='$style.section'/>
		<FriendsSection :class='$style.section'/>
	</BasePageLayout>
</template>

<script lang="ts">
import { PrefetchContext } from "@/prefetch";
import { attachRandomId } from "@/utils";

export default {
	name: "IndexPage",
	asyncData({ data, api }: PrefetchContext) {
		data.cards = api.cards.getAll().then(attachRandomId);
		data.friends = api.friend.getAll().then(attachRandomId);
	},
};
</script>

<script setup lang="ts">
import BasePageLayout from "@/components/BasePageLayout.vue";
import PageMeta from "@/components/PageMeta";
import TopNav from "@/components/top-nav/TopNav.vue";
import BlogSection from "./BlogSection.vue";
import FriendsSection from "./FriendsSection.vue";

/**
 * 之前曾使用多个背景图，在不同的时间段切换，但后来又取消了这种设计，原因如下：
 * 1）需要多个图片并与时间段配合，在没有画师的情况下难以做到。
 * 2）若以客户端时间为准，则 SSR 中无法选择图片，导致 LCP 延迟，这个性能问题是不可接受的。
 */
</script>

<style module lang="less">
@import "../../css/imports";

.nav {
	position: absolute;
	top: 0;

	@media screen and (max-width: @length-screen-mobile) {
		position: fixed;
	}
}

.banner {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	height: 38vh;
	font-size: 18px;

	background-image: url("../../assets/img/IndexBannerLight.png");
	background-size: cover;
	background-position: center bottom;

	@media screen and (min-width: @length-screen-mobile) {
		height: 100vh;
	}

	@media screen and (min-width: @length-screen-wide) {
		font-size: 30px;
	}
}

.title {
	font-size: 2em;
	margin-bottom: 0;

	@media screen and (min-width: @length-screen-wide) {
		font-size: 2.5em;
		margin-bottom: .4em;
	}
}

.section {
	max-width: 1600px;
	margin: 48px 24px;

	@media screen and(min-width: @length-screen-mobile) {
		margin: 64px;
	}
}
</style>
