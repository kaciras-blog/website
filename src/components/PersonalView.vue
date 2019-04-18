<template>
	<div :class="$style.container">
		<router-link
			v-if="user && user.id > 0"
			to="/profile"
			tag="header"
			:class="$style.header">

			<img :src="user.head"
				 alt="用户头像"
				 class="small head"
				 :class="$style.head"
				 title="用户头像">
			<span :class="$style.name">{{user.name}}</span>
		</router-link>
		<router-link
			v-else
			to="/login"
			tag="header"
			:class="$style.header">

			<img src="/image/akalin.jpg"
				 alt="点击登陆"
				 class="small head"
				 :class="$style.head"
				 title="点击登陆">
			<span :class="$style.name">点击登陆</span>
		</router-link>

		<div :class="$style.body">
			<router-link :class="$style.link" to="/">首页</router-link>
			<router-link :class="$style.link" to="/list">文章页</router-link>
			<router-link :class="$style.link" to="/about">关于本站</router-link>
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

export default {
	name: "PersonalView",
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
	cursor: pointer;
}

.name {
	margin-left: 10px;
}

.link {
	display: block;
	padding: 10px 20px;
}

.body {
	flex: 1;
}

.footer {
	padding: 20px;
}
</style>
