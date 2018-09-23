<template>
	<base-login-form @ok="login">
		<h1 class="center segment">登录</h1>

		<label for="name">用户名:</label>
		<input id="name" v-model="form.name" required autofocus>

		<label for="password">密码:</label>
		<input id="password" v-model="form.password" type="password" required>

		<div class="center">
			<kx-check-box v-model="form.remenber">保持登录</kx-check-box>
		</div>

		<span class="text-warning center">{{message}}</span>

		<button slot="button" type="button"
				class="outline"
				@click="login">确定</button>

		<button slot="button" type="button"
				class="second outline"
				@click="switchPanel">注册</button>
	</base-login-form>
</template>

<script>
import api from "../apis";
import { showErrorDialog, pageReturn } from "../utils";
import BaseLoginForm from "./BaseLoginForm";

export default {
	name: "LoginPanel",
	components: { BaseLoginForm },
	data() {
		return {
			message: "",
			form: {
				name: "",
				password: "",
				remenber: false,
			},
		};
	},
	methods: {
		login() {
			api.session.login(this.form)
				.then(pageReturn)
				.catch(showErrorDialog(this, "登录失败"));
		},
		switchPanel() {
			this.$emit("switch-panel", "SignupPanel");
			// this.$messageBox("别注册了", "个人博客你注册干嘛？\n评论的话匿名的就好")
		},
	},
};
</script>
