<!--suppress XmlDuplicatedId -->
<template>
	<!-- 小屏幕折叠状态 -->
	<div id="top-nav" v-if="collapse">
		<nav class="content">
			<div></div>
			<router-link
				class="logo-kaciras"
				to="/welcome"
				title="LOGO，点击回到首页"/>
			<div class="button" @click="showMenu=true"><i class="fas fa-bars"></i></div>
		</nav>
	</div>

	<!-- 展开状态 -->
	<div id="top-nav" v-else>
		<nav :class="$style.content">

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

			<div class="nav-item-group" v-if="user">
				<img :src="user.head"
					 class="small head"
					 title="别看了，不支持换头像">
				<router-link
					v-if="user.id === 2"
					to="/console"
					class="nav-item">管理
				</router-link>
				<div @click="logout" class="nav-item">退出登录</div>
			</div>

			<div class="nav-item-group" v-else>
				<router-link class="nav-item" to="/login">登录</router-link>
			</div>
		</nav>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { REMOVE_USER } from "../store/types";

export default {
	name: "TopNav",
	data() {
		return {
			collapse: false,
			showMenu: false,
		};
	},
	computed: {
		...mapState(["user"]),
	},
	methods: {
		...mapActions({ logout: REMOVE_USER }),
	},
};
</script>

<style lang="less">
@import "../css/ToBeImpoert.less";

#top-nav {
	.glass;
	.glass.blur(4px);

	position: absolute;
	z-index: 500;
	left: 0;
	right: 0;
	top: 0;
	height: 3rem;
	box-shadow: rgba(100, 100, 100, 0.2) 0 0 3px 2px;

}

#top-nav::before,
#banner {
	background: var(--background);
	background-size: var(--background-size, cover); // 这个属性写一起毛病多
}

#banner {
	height: 11rem;
	margin-bottom: 4rem;
}
</style>

<style scoped lang="less">
.menu {
	position: absolute;
	top: 3rem;
	background-color: rgba(0, 0, 0, 0.2);
	& > * {
		border-bottom: solid 1px #c5c5c5;
	}
}

.head {
	margin: 0 .5rem;
}
</style>

<style module lang="less">
@import "../css/ToBeImpoert.less";

.content {
	position: relative;
	display: flex;
	justify-content: space-between;

	padding: 0 1rem;
	.full-percent;

	background-color: rgba(255, 255, 255, 0.5);

	@media screen {
		@media (min-width: @length-screen-mobile) {
			padding: 0 5%;
		}
	}
}
</style>
