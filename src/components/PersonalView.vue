<template>
	<div :class="$style.container">

		<div :class="$style.header">
			<img src="../assets/img/logo-kaciras-circle.svg"
				 alt="Kaciras' Blog"
				 class="head"
				 :class="$style.head">

			<p :class="$style.name">Kaciras' Blog</p>
		</div>

		<div :class="$style.body">
			<side-menu-link to="/" icon="fas fa-home">首页</side-menu-link>
			<side-menu-link to="/list" icon="far fa-list-alt">文章列表</side-menu-link>
			<side-menu-link to="/about" icon="far fa-copyright">关于本站</side-menu-link>
			<side-menu-link to="/login" icon="fas fa-sign-in-alt">登录</side-menu-link>
		</div>

		<div :class="$style.footer">
			<kx-button
				v-if="user && user.id > 0"
				class="second"
				@click="logout">
				退出登录
			</kx-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { REMOVE_USER } from "../store/types";
import SideMenuLink from "./SideMenuLink";

export default {
	name: "PersonalView",
	components: { SideMenuLink },
	computed: mapState(["user"]),
	methods: mapActions({ logout: REMOVE_USER }),
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
	padding: 20px;
	text-align: center;
}

.name {
	font-size: 20px;
	margin: 10px 0 0 0;
}


.body {
	flex-grow: 1;
	font-size: 18px;
}

.footer {
	padding: 20px;
}
</style>
