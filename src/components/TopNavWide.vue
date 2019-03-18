<template>
	<nav :class="$style.container">

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

		<div class="nav-item-group">

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
				<button
					@click="logout"
					class="nav-item">
					退出登录
				</button>
			</template>

			<template v-else>
				<router-link
					to="/login"
					class="nav-item">
					登录
				</router-link>
			</template>

			<router-link to="/about" class="nav-item">关于</router-link>
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
	vertical-align: top;
	margin: 0 .5rem;
}

.container {
	position: relative;
	display: flex;
	justify-content: space-between;
	.full-percent;

	background-color: rgba(255, 255, 255, .4);

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 0 5%;
		}
	}
}

:global(.dark) .container {
	background-color: rgba(255, 255, 255, .1);
}
</style>
