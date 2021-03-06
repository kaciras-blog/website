<template>
	<component :is="tag" class="top-nav" :class="[$style.container, { [$style.colored]: colored }]">
		<router-link to="/" title="回到首页" :class="$style.logoLink">
			<img src="@/assets/img/logo-kaciras-wide.svg" alt="logo" :class="$style.logo">
		</router-link>

		<!-- 手机屏的折叠菜单 -->
		<button
			v-if="$mediaQuery.match('mobile')"
			title="弹出菜单"
			class="nav-item nav-right"
			@click="showMenu"
		>
			<i class="fas fa-bars"/>
		</button>

		<!-- 宽屏直接把按钮都显示在上面 -->
		<div v-else class="nav-right">

			<template v-if="user.id > 0">
				<router-link to="/profile">
					<img
						:src="user.avatar"
						alt="用户头像"
						title="就是一个头像而已"
						class="small head"
						:class="$style.head"
					>
				</router-link>
				<router-link
					v-if="user.id === 2"
					to="/console"
					class="nav-item"
				>
					管理
				</router-link>
				<button class="nav-item" @click="logout">退出登录</button>
			</template>

			<router-link v-else to="/login" class="nav-item">登录</router-link>

			<router-link to="/list" class="nav-item">文章</router-link>
			<router-link to="/about/me" class="nav-item">关于</router-link>

			<a href="/feed/atom" class="nav-item" title="Feed订阅">
				<i class="fas fa-rss" :class="$style.fontIcon"/>
			</a>
			<button class="nav-item" title="设置" @click="showSettings">
				<i class="fas fa-cogs" :class="$style.fontIcon"/>
			</button>
		</div>
	</component>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { LOGOUT } from "@/store/types";
import NavMenuFrame from "./NavMenuFrame";
import SettingDialog from "./SettingDialog";

export default {
	name: "TopNavBody",
	components: {
		NavMenuFrame,
	},
	props: {
		tag: String,
	},
	data: () => ({
		colored: false,
	}),
	computed: mapState(["user"]),
	methods: {
		...mapActions({ logout: LOGOUT }),

		showMenu() {
			this.$dialog.show(NavMenuFrame);
		},

		scrollFunction() {
			this.colored = document.body.scrollTop > 16 || document.documentElement.scrollTop > 16;
		},

		showSettings() {
			this.$dialog.show(SettingDialog);
		},
	},
	beforeMount() {
		if (this.$mediaQuery.match("mobile")) {
			window.addEventListener("scroll", this.scrollFunction);
		}
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.scrollFunction);
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
	background-color: rgba(255, 255, 255, .5);
	transition: background-color .3s;

	@media screen and (max-width: @length-screen-mobile) {
		position: sticky;
		top: 0;
	}

	@media screen and (min-width: @length-screen-pad) {
		padding: 0 5vw;
	}
}

// 外层套了个<a>所以宽高不能用百分比，只能写死图片的大小
.logo {
	display: block;
	width: calc(var(--nav-height) * 3);
	height: var(--nav-height);

	object-fit: cover;
	object-position: top;

	&:hover {
		object-position: bottom;
	}
}

.logoLink:focus > .logo {
	object-position: bottom;
}

.head {
	vertical-align: top;
	margin: 0 10px;
}

.fontIcon {
	font-size: 20px;
	vertical-align: middle;

	// 固定宽度防止字体加载后重排
	// TODO: 下一版不用垃圾字体图标了
	width: 25px;
	text-align: center;
}

:global(.dark) .container {
	background-color: rgba(255, 255, 255, .1);
}

// 懒得改了重构整个TopNav，先用 !important 凑合过吧
.colored {
	background-color: white !important;
}

.colored :global(.nav-item) {
	color: black !important;
}
</style>
