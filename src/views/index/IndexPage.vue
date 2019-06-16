<template>
	<base-page-layout>

		<!-- 经过1小时的尝试仍未能做到模糊层背景定位，已放弃 -->
		<template v-slot:nav>
			<top-nav-glass :class="$style.nav"/>
		</template>

		<section :class="$style.banner">
			<h1>Kaciras' Blog</h1>
			<p :class="$style.sub_title">程序 • 生活 • 梦想</p>
		</section>

		<blog-section :class="$style.blog"/>
	</base-page-layout>
</template>

<script>
import BlogSection from "./BlogSection";
import api from "../../api";
import { attachRandomId } from "../../utils";

export default {
	name: "IndexPage",
	components: {
		BlogSection,
	},
	asyncData(session) {
		return api.recommend.swiper.get()
			.then(slides => session.data.slides = slides.map(attachRandomId));
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

:global(#welcome-page) {
	margin-bottom: 100px;
}

.nav {
	position: absolute !important;
	top: 0;
}

.banner {
	padding-top: 35vh;
	height: 100vh;

	text-align: center;

	background-image: url("../../assets/img/68079722.jpg");
	background-size: cover;
	background-position: center bottom;

	& > h1 {
		font-size: 5rem;
	}
}

.sub_title {
	font-size: 2rem;
}

.blog {
	padding: 0 5vw;
	margin-bottom: 60px;
}
</style>
