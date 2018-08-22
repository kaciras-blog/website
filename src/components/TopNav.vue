<!--suppress XmlDuplicatedId -->
<template>
<header :style="optionalStyle">
	<!-- 小屏幕折叠状态 -->
	<nav id="top-nav" v-if="collapse">
		<div class="content">
			<div></div>
			<router-link to="/" class="logo" title="花了5分钟画的logo，点击回到首页"/>
			<div class="button" @click="showMenu=true"><i class="fas fa-bars"></i></div>
		</div>
	</nav>

	<!-- 展开状态 -->
	<nav id="top-nav" v-else>
		<div class="content">
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

			<div class="nav-item-group" v-else>
				<router-link class='nav-item' to='/console'>管理</router-link>
				<router-link class="nav-item" to="/login">登录</router-link>
			</div>
		</div>
	</nav>

	<!-- 最下面的大图 -->
	<div id="banner" v-if="banner"></div>
</header>
</template>

<script>
import apis from "../apis";
import Vuex from "vuex";

export default {
	name: "TopNav",
	props: {
		background: {
			type: String,
			default: "none",
		},
		backgroundAttach:{
			type: String,
			default: "scroll",
		},
		banner: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			collapse: false,
			showMenu: false,
		};
	},
	computed: {
		optionalStyle() {
			return {
				"--background": "url(" + this.background + ") " + this.backgroundAttach,
			};
		},
		...Vuex.mapState(["user"]),
	},
	methods: {
		logout() {
			apis.session.logout();
			this.$store.commit("clearUser");
		},
	},
	created() {
		// window.addEventListener("resize", ev => this.collapse = window.innerWidth <= 768)
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

	& > .content {
		position: relative;
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.3);

		padding: 0 1rem;

		@media screen {
			@media (min-width: @length-screen-mobile) {
				padding: 0 5%;
			}
		}
	}

	&::before {
		background: var(--background, none);
		background-size: cover;
	}
}

#banner {
	height: 180px;
	width: 100%;
	background: var(--background, none);
	@media screen and (min-width: 768px) {
		margin-bottom: 3rem;
	}
}

#banner, #top-nav::before {
	background-position: center 0;
	background-size: cover;
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

.nav-item {
	display: inline-block;
	font-size: 16px;
	padding: .8rem 1.5rem;
	background-color: transparent;
	height: 100%;

	&:hover {
		color: @color-text;
		text-decoration: none;
		background-color: rgba(255, 255, 255, 0.4);
	}
}
</style>
