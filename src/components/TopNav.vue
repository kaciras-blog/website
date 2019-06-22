<template>
	<nav class="top-nav" :class="$style.container">

		<router-link to="/" title="回到首页">
			<img src="../assets/img/logo-kaciras-wide.svg" alt="logo" :class="$style.logo">
		</router-link>

		<!-- 手机屏的折叠菜单 -->
		<button
			v-if="$mediaQuery.match('mobile')"
			title="弹出菜单"
			class="nav-item nav-right"
			@click="showMenu"
		>
			<i class="fas fa-bars"></i>
		</button>

		<!-- 宽屏直接把按钮显示在上面 -->
		<div v-else class="nav-right">

			<template v-if="user && user.id > 0">

				<router-link to="/profile">
					<img :src="user.head"
						 alt="用户头像"
						 title="就是一个头像而已"
						 class="small head"
						 :class="$style.head">
				</router-link>

				<router-link
					v-if="user.id === 2"
					to="/console"
					class="nav-item">
					管理
				</router-link>

				<button class="nav-item" @click="logout">退出登录</button>
			</template>

			<router-link v-else to="/login" class="nav-item">登录</router-link>
			<router-link to="/about" class="nav-item">关于</router-link>
		</div>
	</nav>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { REMOVE_USER } from "../store/types";
import TopNavMenu from "./TopNavMenu";

export default {
	name: "TopNav",
	computed: {
		...mapState(["user"]),
	},
	methods: {
		showMenu() {
			this.$dialog.show(TopNavMenu);
		},
		...mapActions({ logout: REMOVE_USER }),
	},
};
</script>

<style module lang="less">
@import "../css/Imports.less";

.container {
	display: flex;
	width: 100%;
	background-color: rgba(255, 255, 255, .4);

	@media screen and (min-width: @length-screen-mobile) {
		padding: 0 5vw;
	}
	@media screen and (max-width: @length-screen-mobile) {
		position: sticky;
		top: 0;
		background-color: white;
	}
}

// 外层套了个<a>所以宽高不能用百分比，只能写死图片的大小
.logo {
	display: block;
	width: 150px;
	height: 50px;

	object-fit: cover;
	object-position: top;

	&:hover, &:focus {
		object-position: 0 -50px;
	}
}

.head {
	vertical-align: top;
	margin: 0 10px;
}

:global(.dark) .container {
	background-color: rgba(255, 255, 255, .1);
}
</style>
