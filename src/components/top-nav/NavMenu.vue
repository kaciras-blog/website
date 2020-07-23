<template>
	<div :class="$style.container">

		<div :class="$style.header">
			<div :class="$style.header_content">
				<img
					src="@/assets/img/logo-kaciras-circle.svg"
					alt="Kaciras' Blog"
					class="head"
					:class="$style.head"
				>
				<p :class="$style.name">Kaciras' Blog</p>
			</div>
		</div>

		<div :class="$style.body">
			<side-menu-link to="/" icon="fas fa-home">首页</side-menu-link>
			<side-menu-link to="/list" icon="far fa-list-alt">文章列表</side-menu-link>
			<side-menu-link to="/about" icon="far fa-copyright">关于</side-menu-link>
			<side-menu-link to="/login" icon="fas fa-sign-in-alt">登录</side-menu-link>

			<side-menu-link tag="a" to="/feed/rss" icon="fa fa-rss">Feed订阅</side-menu-link>

			<side-menu-link tag="div" icon="fas fa-sliders-h" @click="showSettingFrame">设置</side-menu-link>
		</div>

		<div :class="$style.footer">
			<kx-button
				v-if="user.id > 0"
				class="second"
				@click="logout"
			>
				退出登录
			</kx-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { LOGOUT } from "@/store/types";
import SideMenuLink from "./SideMenuLink";
import SettingFrame from "./SettingFrame";

export default {
	name: "NavMenu",
	components: { SideMenuLink },
	computed: mapState(["user"]),
	methods: {
		showSettingFrame() {
			this.$dialog.show(SettingFrame);
		},
		...mapActions({ logout: LOGOUT }),
	},
};
</script>

<style module lang="less">
.container {
	display: flex;
	flex-direction: column;
	background: white;

	font-size: 16px; /* TODO: hack */
}

.header {
	background: url("../../assets/img/54045756_p0.png");
	background-size: cover;
}

.header_content {
	padding: 35px 0;
	color: black;
	background: rgba(255, 255, 255, .15);
	text-align: center;
}

.name {
	font-size: 20px;
	margin: 10px 0 0 0;
}

.body {
	flex-grow: 1;
	padding: 10px 0;
}

.button {
	padding: 12px 1pc;
	cursor: pointer;

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}

.footer {
	padding: 20px;
}
</style>
