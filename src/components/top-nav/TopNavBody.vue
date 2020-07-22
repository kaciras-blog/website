<template>
	<component :is="tag" class="top-nav" :class="[$style.container, { [$style.colored]: colored }]">
		<router-link to="/" title="回到首页" :class="$style.logoLink">
			<img src="@/assets/img/logo-kaciras-wide.svg" alt="logo" :class="$style.logo">
		</router-link>

		<!-- 手机屏的折叠菜单 -->
		<template v-if="$mediaQuery.match('mobile')">
			<button
				title="弹出菜单"
				class="nav-item nav-right"
				@click="showNavMenu = true"
			>
				<i class="fas fa-bars"/>
			</button>
			<nav-menu-frame v-model="showNavMenu"/>
		</template>

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
			<router-link to="/about" class="nav-item">关于</router-link>

			<a href="/feed/atom" class="nav-item" title="Feed订阅">
				<i class="fas fa-rss" :class="$style.icon_only"></i>
			</a>
		</div>
	</component>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { LOGOUT } from "@/store/types";
import NavMenuFrame from "./NavMenuFrame";

export default {
	name: "TopNavBody",
	components: {
		NavMenuFrame,
	},
	props: {
		tag: String,
	},
	data: () => ({
		showNavMenu: false,
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

	@media screen and (min-width: @length-screen-mobile) {
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

	&:hover{
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

.icon_only {
	font-size: 20px;
	vertical-align: middle;
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
