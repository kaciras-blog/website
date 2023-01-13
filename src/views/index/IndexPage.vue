<template>
	<BasePageLayout>
		<PageMeta title='首页' body-class=''/>

		<!-- 经过1小时的尝试仍未能做到模糊层背景定位，已放弃 -->
		<template #nav>
			<TopNavGlass :class='$style.nav'/>
		</template>

		<section :class='$style.banner'>
			<div :class='$style.banner_content'>
				<h1 :class='$style.title'>Kaciras' Blog</h1>
				编程 • 生活 • 梦想
			</div>
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
import TopNavGlass from "@/components/top-nav/TopNavGlass.vue";
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
	position: absolute !important;
	top: 0;

	@media screen and (max-width: @length-screen-mobile) {
		position: fixed !important;
	}
}

.banner {
	display: flex;
	justify-content: center;
	align-items: center;

	height: 100vh;
	background-image: url("../../assets/img/IndexBannerLight.png");
	background-position: center bottom;
	background-size: cover;

	@media screen and (max-width: @length-screen-mobile) {
		height: 38vh;
	}
}

.banner_content {
	position: relative;

	font-size: 18px;
	text-align: center;
	transition: color 1s cubic-bezier(.25, .7, .7, .8);

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
