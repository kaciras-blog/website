<template>
	<base-login-form @ok="login">
		<h1 class="center segment">登录</h1>

		<label>用户名:</label>
		<input
			title="用户名"
			v-model="form.name"
			required
			autofocus>

		<label>密码:</label>
		<input
			title="密码"
			v-model="form.password"
			type="password"
			required>

		<div class="center">
			<kx-check-box v-model="form.remember">保持登录</kx-check-box>
		</div>

		<span class="text-warning center">{{message}}</span>

		<div class="buttons">
			<kx-task-button
				class="primary outline"
				:on-click="login">
				确定
			</kx-task-button>
			<kx-button
				class="second outline"
				@click="switchPanel">
				注册
			</kx-button>
		</div>

		<span class="center" :class="$style.separtor">第三方登录</span>
		<div class="center">
			<oauth-icon endpoint="github" icon="github.png" tip="Github登录"/>

			<!-- ADBlock会拦截谷歌图标，必须改个名 -->
			<oauth-icon endpoint="google" icon="xoago.png" tip="Google登录"/>
		</div>
	</base-login-form>
</template>

<script>
import api from "../../api";
import { errorMessage } from "../../utils";
import BaseLoginForm from "./BaseLoginForm";
import { REFRESH_USER } from "../../store/types";
import OauthIcon from "../../components/OauthIcon";

export default {
	name: "LoginPanel",
	components: { OauthIcon, BaseLoginForm },
	data: () => ({
		message: "",
		form: {
			name: "",
			password: "",
			remember: false,
		},
	}),
	methods: {
		async login () {
			try {
				await api.user.login(this.form);
				await this.$store.dispatch(REFRESH_USER);
				this.$router.push(this.$route.params.return || "/");
			} catch (e) {
				this.message = errorMessage(e);
			}
		},
		switchPanel () {
			this.$emit("switch-panel", "SignupPanel");
			// this.$dialog.messageBox("别注册了", "个人博客你注册干嘛？\n建议使用第三方登录");
		},
	},
};
</script>

<style module lang="less">
.separtor {
	position: relative;
	color: #747474;
	margin-top: .5rem;

	&::before, &::after {
		content: "";
		position: absolute;
		background-color: #a4a4a4;
		height: 1px;
		top: 50%;
		width: 35%;
	}

	&::before {
		right: 0;
	}
	&::after {
		left: 0;
	}
}
</style>
