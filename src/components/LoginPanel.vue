<template>
	<form class="flex vertical margin-vert" @keyup.13="login()">
		<h1 class="center compact">登录</h1>
		<hr>
		<label>
			<span>用户名:</span>
			<input v-model="form.name" required autofocus>
		</label>
		<label>
			<span>密码:</span>
			<input v-model="form.password" type="password" required>
		</label>

		<div class="flex center-content">
			<label class="check-box"><input v-model="form.remenber" type="checkbox"><span>保持登录</span></label>
		</div>

		<span class="text-warning">{{message}}</span>

		<div class="flex margin momo">
			<button type="button" class="primary square" @click="login()">确定</button>
			<button type="button" class="square" @click="switchPanel()">注册<i class="fa fa-arrow-right"></i></button>
		</div>
	</form>
</template>

<script>
import apis from "../apis";
import {pageReturn, errMsg} from "../utils";

export default {
	name: "LoginPanel",
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
	methods:{
		login() {
			apis.session.login(this.form).then(pageReturn).catch(err => this.message = errMsg(err));
		},
		switchPanel() {
			this.$emit("switch-panel", "signupPanel");
			// this.$messageBox("别注册了", "个人博客你注册干嘛？\n评论的话匿名的就好")
		},
	},
};
</script>
