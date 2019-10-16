<template>
	<base-page-layout>

		<!-- 经过1小时的尝试仍未能做到模糊层背景定位，已放弃 -->
		<template #nav>
			<top-nav-glass :class="navClass"/>
		</template>

		<section :class="$style.banner" :style="{ backgroundImage: banner && `url(${banner})` }">

			<!-- 用于背景图片切换的渐变效果 -->
			<transition
				:enter-class="$style.enter_before"
				:enter-active-class="$style.active_enter"
				@after-enter="transitionEnd"
			>
				<div
					v-if="transitionImage"
					class="full-vertex"
					:class="$style.banner"
					:style="{ backgroundImage: `url(${transitionImage})` }"
				/>
			</transition>

			<div
				:class="$style.banner_content"
				:style="titleStyle"
			>
				<h1 @click.middle="nextSunPhase">Kaciras' Blog</h1>
				<p :class="$style.sub_title">程序 • 生活 • 梦想</p>
			</div>
		</section>

		<blog-section :class="$style.blog"/>
		<friends-section :class="$style.friends"/>
	</base-page-layout>
</template>

<script>
import { mapState } from "vuex";
import { attachRandomId } from "@/utils";
import api from "@/api";
import { SUN_PHASES } from "@/store";
import BlogSection from "./BlogSection";
import FriendsSection from "./FriendsSection";

/*
 * 由于服务端无法获取客户的时间，导致服务端渲染时无法获取太阳位置。
 *
 * 如果此时用一个默认值，例如白天，那么当客户端时间不是白天时，一加载页面看到的仍是白天主题，
 * 但马上又变为其它的样式，造成闪烁影响用户体验。
 *
 * 所以干脆SSR的输出就留个空白，等到执行JS设置了太阳位置后再显示图片，
 * 反正图片加载完毕前也是白的，刚好表现一致。
 *
 * 这样的话如果不开启JS就看不到图，但是我的SSR是用来做SEO和加速的，本站也不支持关闭JS访问，所以没问题。
 */
const BANNER_MAP = {
	// Dawn: require("../../assets/img/IndexBannerDawn.png?size=IndexBannerMobile"),
	Dawn: require("../../assets/img/IndexBannerDawn.png"),
	Daytime: require("../../assets/img/IndexBannerLight.png"),
	Dusk: require("../../assets/img/IndexBannerDusk.png"),
	Night: require("../../assets/img/IndexBannerNight.png"),
};

export default {
	name: "IndexPage",
	components: {
		FriendsSection,
		BlogSection,
	},
	asyncData(session) {
		return Promise.all([
			api.recommend.getCards().then(slides => session.data.slides = slides.map(attachRandomId)),
			api.friend.getFriends().then(friends => session.data.friends = friends.map(attachRandomId)),
		]);
	},
	data() {
		return {
			transitionImage: null,
			banner: BANNER_MAP[this.$store.state.sunPhase],
		};
	},
	computed: {
		navClass() {
			if (this.sunPhase === "Night") {
				return [this.$style.nav, "dark"];
			}
			return [this.$style.nav];
		},
		titleStyle() {
			return this.sunPhase === "Night" && { color: "deeppink" };
		},
		...mapState(["sunPhase"]),
	},
	methods: {
		switchBanner(sunPhase) {
			this.transitionImage = BANNER_MAP[sunPhase];
		},
		/** 在图片切换效果结束后调用 */
		transitionEnd() {
			this.$_lock = false;
			this.banner = this.transitionImage;
			this.transitionImage = null;
		},
		nextSunPhase() {
			if (this.$_lock) {
				return;
			}
			this.$_lock = true;
			this.$store.commit("SET_SUN_PHASE", SUN_PHASES.nextOf(this.sunPhase));
		},
	},
	beforeMount() {
		this.$store.watch((state) => state.sunPhase, this.switchBanner);
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
	height: 100vh;
	background-position: center bottom;
	background-size: cover;
}

.active_enter {
	transition: opacity 1s linear;
}

.enter_before {
	opacity: 0;
}

.banner_content {
	position: absolute;
	top: 34vh;
	left: 30px;
	right: 30px;

	text-align: center;
	transition: all 1s cubic-bezier(.25, .7, .7, .8);

	& > h1 {
		font-size: 5rem;
		margin-bottom: 40px;
	}
}

.sub_title {
	font-size: 2rem;
}

.blog {
	padding: 0 5vw;
}

.friends {
	padding: 60px 5vw;
}
</style>
