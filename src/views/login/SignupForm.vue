<template>
	<base-login-form @ok="signup">
		<h1 class="center segment">注册</h1>

		<label>用户名:</label>
		<input
			v-model="form.name"
			placeholder="中英文数字和下划线"
			required>

		<label>密码:</label>
		<input
			v-model="form.password"
			type="password"
			placeholder="至少有个6位吧"
			required>

		<label>邮箱:</label>
		<input
			v-model="form.email"
			type="email"
			placeholder="不填也行">

		<label>验证码:</label>
		<div class="captcha">
			<input
				class="input-captcha"
				title="验证码"
				ref="captchaInput"
				v-model="form.captcha"
				required>

			<img :src="captcha"
				 title="点击换一张"
				 @click="updateCaptcha">
		</div>

		<span class="text-warning center">{{message}}</span>

		<kx-task-button
			slot="button"
			class="primary outline"
			:on-click="signup">
			确定
		</kx-task-button>
		<kx-button
			slot="button"
			class="second outline"
			@click="switchPanel">
			登录
		</kx-button>
	</base-login-form>
</template>

<script>
import api from "../../api";
import { errorMessage } from "../../utils";
import BaseLoginForm from "./BaseLoginForm";
import { REFRESH_USER } from "../../store/types";

export default {
	name: "SignupPanel",
	components: { BaseLoginForm },
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
		async signup() {
			try {
				await api.user.signup(this.form);
				await this.$store.dispatch(REFRESH_USER);
				this.$router.push(this.$route.params.return || "/");
			} catch(e) {
				this.message = errorMessage(e);
			}
		},
		switchPanel() {
			this.$emit("switch-panel", "LoginPanel");
		},
		updateCaptcha() {
			this.captcha = api.misc.captchaAddress;
			this.form.captcha = "";
			this.$refs.captchaInput.focus();
		},
	},
	mounted() {
		this.captcha = api.misc.captchaAddress;
	},
};
</script>

<style scoped lang="less">
.captcha {
	& > img {
		width: 150px;
		height: 40px;
		cursor: pointer;
	}
}

.input-captcha {
	width: calc(100% - 150px - 1em);
	margin-right: 1em;
}
</style>
