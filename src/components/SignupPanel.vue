<template>
<form @keyup.13="signup">
	<h1 class="center segment">注册</h1>

	<label>用户名:</label>
	<input v-model="form.name" placeholder="中英文数字和下划线" required>

	<label>密码:</label>
	<input v-model="form.password" type="password" placeholder="至少有个6位吧" required>

	<label>邮箱:</label>
	<input v-model="form.email" type="email" placeholder="不填也行">

	<label for="captcha" class="expansion">验证码:</label>
	<div>
		<input id="captcha" ref="captchaInput" v-model="form.captcha" required>
		<img class="captcha" :src="captcha" title="点击换一张" @click="updateCaptcha()">
	</div>

	<span class="text-warning center">{{message}}</span>

	<div class="center">
		<button type="button" class="primary square" @click="signup">确定</button>
		<button type="button" class="square" @click="switchPanel"><i class="fa fa-arrow-left"></i>登录</button>
	</div>
</form>
</template>

<script>
import api from "../apis";
import {pageReturn, errMsg} from "../utils";

export default {
	name: "SignupPanel",
	data() {
		return {
			message: "",
			captcha: null,
			form: {
				name: "",
				password: "",
				email: "",
				captcha: "",
			},
		};
	},
	methods: {
		signup() {
			api.user.signup(this.form)
				.then(pageReturn)
				.catch(err => this.message = errMsg(err));
		},
		switchPanel() {
			this.$emit("switch-panel", "LoginPanel");
		},
		updateCaptcha() {
			this.captcha = api.captchaAddress();
			this.form.captcha = "";
			this.$refs.captchaInput.focus();
		},
	},
	created() {
		this.updateCaptcha();
	},
};
</script>

<style scoped lang="less">
.captcha {
	cursor: pointer;
}

form {
	display: grid;
	grid-template-columns: 4em 1fr;
	grid-gap: 1em;
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
</style>
