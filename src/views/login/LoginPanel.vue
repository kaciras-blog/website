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

		<kx-task-button
			slot="button"
			class="primary outline"
			:on-click="login">
			确定
		</kx-task-button>
		<kx-button
			slot="button"
			class="second outline"
			@click="switchPanel">
			注册
		</kx-button>
	</base-login-form>
</template>

<script>
import api from "../../apis";
import { errorMessage } from "../../utils";
import BaseLoginForm from "./BaseLoginForm";
import {REFRESH_USER} from "../../store/user";

export default {
	name: "LoginPanel",
	components: { BaseLoginForm },
	data() {
		return {
			message: "",
			form: {
				name: "",
				password: "",
				remember: false,
			},
		};
	},
	methods: {
		async login() {
			try {
				await api.session.login(this.form);
				await this.$store.dispatch(REFRESH_USER);
				this.$router.push(this.$route.params.return || "/");
			} catch (e) {
				this.message = errorMessage(e);
			}
		},
		switchPanel() {
			this.$emit("switch-panel", "SignupPanel");
			// this.$messageBox("别注册了", "个人博客你注册干嘛？\n评论的话匿名的就好")
		},
	},
};
</script>
