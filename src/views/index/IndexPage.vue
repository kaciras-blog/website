<template>
	<base-page-layout>

		<!-- 经过1小时的尝试仍未能做到模糊层背景定位，已放弃 -->
		<template #nav>
			<top-nav-glass :class="navClass"/>
		</template>

		<section :class="$style.banner" :style="{ backgroundImage: `url(${banner})` }">
			<transition
				:enter-class="$style.enter_before"
				:enter-active-class="$style.active_enter"
				@after-enter="replaceBackground"
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
import BlogSection from "./BlogSection";
import FriendsSection from "./FriendsSection";
import { SUN_PHASES } from "@/store";

/*
 * 由于SSR的存在，并且服务端无法获取客户的时间，只能默认用白天的主题，
 * 这导致当客户端时间不是白天时，一加载页面看到的仍是白天主题，但马上又变为其它的样式。
 * 目前来看没有解决办法，这是服务端渲染固有的缺陷。
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
		replaceBackground() {
			this.$_lock = false;
			this.banner = this.transitionImage;
			this.transitionImage = null;
		},
		switchBanner(sunPhase) {
			this.transitionImage = BANNER_MAP[sunPhase];
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
