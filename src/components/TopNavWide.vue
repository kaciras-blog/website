<template>
	<nav id="top-nav">
		<div :class="$style.content">

			<!-- 左边 -->
			<div class="nav-item-group">
				<router-link
					class="logo-kaciras"
					to="/"
					title="LOGO，点击回到首页"/>
				<!--<router-link-->
				<!--to="/"-->
				<!--class="nav-item">博客-->
				<!--</router-link>-->
			</div>

			<div v-if="user" class="nav-item-group">
				<img :src="user.head"
					 class="small head"
					 :class="$style.head"
					 title="就是一个头像而已">
				<router-link
					v-if="user.id === 2"
					to="/console"
					class="nav-item">
					管理
				</router-link>
				<button
					@click="logout"
					class="nav-item">
					退出登录
				</button>
			</div>

			<div v-else class="nav-item-group">
				<router-link
					to="/login"
					class="nav-item">
					登录
				</router-link>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { REMOVE_USER } from "../store/types";

export default {
	name: "TopNavWide",
	computed: {
		...mapState(["user"]),
	},
	methods: {
		...mapActions({ logout: REMOVE_USER }),
	},
};
</script>

<style module lang="less">
@import "../css/Imports.less";

.head {
	margin: 0 .5rem;
}

.content {
	position: relative;
	display: flex;
	justify-content: space-between;

	padding: 0 1rem;
	.full-percent;

	background-color: rgba(255, 255, 255, 0.4);

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 0 5%;
		}
	}
}

:global(.dark) .content {
	background-color: rgba(255, 255, 255, .1);
}
</style>
