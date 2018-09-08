<template>
	<form @keyup.13="login">
		<h1 class="center segment">登录</h1>

		<label for="name">用户名:</label>
		<input id="name" v-model="form.name" required autofocus>

		<label for="password">密码:</label>
		<input id="password" v-model="form.password" type="password" required>

		<div class="center">
			<label class="check-box"><input v-model="form.remenber" type="checkbox"><span>保持登录</span></label>
		</div>

		<span class="text-warning center">{{message}}</span>

		<div class="buttons">
			<button type="button" class="lightly" @click="login">确定</button>
			<button type="button" class="lightly" @click="switchPanel">注册</button>
		</div>
	</form>
</template>

<script>
import api from "../apis";
import {errMsg, pageReturn} from "../utils";

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
	methods: {
		login() {
			api.session.login(this.form).then(pageReturn).catch(err => this.message = errMsg(err));
		},
		switchPanel() {
			this.$emit("switch-panel", "SignupPanel");
			// this.$messageBox("别注册了", "个人博客你注册干嘛？\n评论的话匿名的就好")
		},
	},
};
</script>

<style scoped lang="less">
form {
	display: grid;
	grid-template-columns: 4em 1fr;
	grid-column-gap: .5em;
	grid-row-gap: 1em;
}

.center {
	text-align: center;
	grid-column: ~"1/3";
}

label {
	align-self: center;
	justify-self: right;
	& + input {
		grid-column-start: 2;
	}
}

.text-warning {
	font-size: 1.1em;
	color: #ff646c;
	height: 1em;
}

.buttons {
	grid-column: ~"1/3";
	display: flex;
	& > * {
		flex: 1;
	}
	& > *:not(:last-child) {
		margin-right: 1rem;
	}
}
</style>
