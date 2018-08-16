<template>
	<nav id="top-nav">
		<div class="content" v-if="collapse">
			<div></div>
			<router-link to="/" class="logo" title="花了5分钟画的logo，点击回到首页"/>
			<div class="button" @click="showMenu=true"><i class="fas fa-bars"></i></div>
		</div>

		<div class="content" v-else>
			<div class="flex center-align compact">
				<router-link to="/" class="logo" title="花了5分钟画的logo，点击回到首页"/>
				<router-link to="/welcome" class="block fold">欢迎页</router-link>
				<!--<a class="block fold" href="/about">关于</a>-->
			</div>

			<div class="flex center-align compact" v-if="user">
				<img :src="'/image/' + user.head" class='head' title='别看了，不支持换头像'>
				<h3 class='user-name'>{{user.name}}</h3>
				<router-link v-if="user.id===1" class='block' to='/console'>管理</router-link>
				<a @click="logout()" class='block'>退出登录</a>
			</div>

			<div class="flex center-align compact" v-else>
				<router-link class="block" to="/login">登录</router-link>
			</div>
		</div>

		<div class="global-dimmer" v-if="showMenu" @click="showMenu=false"></div>
		<div class="menu" v-if="showMenu">
			<div>

			</div>
			<div class="links">
				<router-link class="block fold" to="/welcome">欢迎页</router-link>
				<router-link class="block" to="/login" v-if="!user">登录</router-link>
			</div>
		</div>
	</nav>
</template>

<script>
import apis from "../apis";
import Vuex from "vuex";

export default {
	name: "TopNav",
	data() {
		return {
			collapse: false,
			showMenu: false,
		};
	},
	computed: Vuex.mapState({
		user: store => store.loginedUser,
	}),
	methods: {
		logout() {
			apis.session.logout();
		},
	},
	created() {
		// window.addEventListener("resize", ev => this.collapse = window.innerWidth <= 768)
	},
};
</script>

<style lang="less">
	@import "../css/Main.less";

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

		& > .content {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 100%;
			background-color: rgba(255, 255, 255, 0.4);

			padding: 0 1rem;

			@media screen {
				@media (min-width: @length-screen-mobile) {
					padding: 0 5%;
				}
			}
		}

		&::before {
			background: url("../assets/index-header.jpg");
			background-size: cover;
		}
	}

	.menu {
		position: absolute;
		top: 3rem;
		background-color: rgba(0, 0, 0, 0.2);
		& > * {
			border-bottom: solid 1px #c5c5c5;
		}
	}

	.links > * {
		border-left: solid 1px #c5c5c5;
	}

	.logo {
		display: block;
		background: url("../assets/Logo-Width.png") 0 0;
		width: 9rem;
		height: 100%;
		background-size: 9rem 200%;

		&:hover {
			background-position: 0 100%;
		}
	}
</style>
