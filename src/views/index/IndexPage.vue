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
				<h1 @click="test">Kaciras' Blog</h1>
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

const BANNER_MAP = {
	Dawn: require("../../assets/img/IndexBannerDawn.png?size=IndexBannerMobile"),
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
		switchBanner(nv) {
			if (this.$_lock) {
				return;
			}
			this.$_lock = true;
			this.transitionImage = BANNER_MAP[nv];
		},
		test() {
			index = index < 4 ? index++ : 0;
			this.$store.commit("SET_SUN_PHASE", testD[index++]);
		},
	},
	beforeMount() {
		this.$store.watch((state) => state.sunPhase, this.switchBanner);
	},
};
const testD = Object.keys(BANNER_MAP);
let index = 0;
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
