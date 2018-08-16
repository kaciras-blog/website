<template>
	<form class="flex vertical margin-vert blur glass" @keyup.13="signup()">
		<h1 class="center compact">注册</h1>
		<hr>
		<label>
			<span>用户名:</span>
			<input v-model="form.name" placeholder="中英文数字和下划线" required>
		</label>
		<label>
			<span>密码:</span>
			<input v-model="form.password" type="password" placeholder="至少有个6位吧" required>
		</label>
		<label>
			<span>邮箱:</span>
			<input v-model="form.email" type="email" placeholder="不填也行">
		</label>

		<div class="flex margin-horiz center-align">
			<label class="expansion">
				<span>验证码:</span>
				<input ref="captchaInput" v-model="form.captcha" required>
			</label>
			<img class="captcha" :src="captcha" title="点击换一张" @click="updateCaptcha()">
		</div>

		<span class="text-warning">{{message}}</span>

		<div class="flex margin momo">
			<button type="button" class="primary square" @click="signup()">确定</button>
			<button type="button" class="square" @click="switchPanel()"><i class="fa fa-arrow-left"></i>登录</button>
		</div>
	</form>
</template>

<script>
import apis from "../apis";
import {pageReturn, errMsg} from "../utils";

export default {
	name: "SignupPanel",
	data () {
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
			apis.user.signup(this.form)
				.then(pageReturn)
				.catch(err => this.message = errMsg(err));
		},
		switchPanel() {
			this.$emit("switch-panel", "loginPanel");
		},
		updateCaptcha() {
			this.captcha = apis.captchaAddress();
			this.form.captcha = "";
			this.$refs.captchaInput.focus();
		},
	},
	created() {
		this.updateCaptcha();
	},
};
</script>

<style scoped>
	.captcha{
		cursor: pointer;
	}
</style>
