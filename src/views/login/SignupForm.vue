<template>
	<base-login-form>
		<h1 class="center segment">注册</h1>

		<label for="name">用户名:</label>
		<input id="name"
			   v-model="form.name"
			   placeholder="中英文数字和下划线"
			   required
			   v-autofocus>

		<label for="password">密码:</label>
		<password-input
			input-id="password"
			v-model="form.password"
			placeholder="至少有个6位吧"
			required/>

		<label for="email">邮箱:</label>
		<input id="email"
			   v-model="form.email"
			   type="email"
			   placeholder="（可选）不填也行">

		<label for="captcha">验证码:</label>
		<div :class="$style.captcha">
			<input id="captcha"
				   :class="$style.inputCaptcha"
				   title="验证码"
				   ref="captchaInput"
				   v-model="form.captcha"
				   required>

			<img :src="captcha"
				 alt="验证码"
				 title="点击换一张"
				 @click="updateCaptcha">
		</div>

		<span class="text-warning center">{{message}}</span>

		<div class="buttons">
			<kx-task-button
				class="primary outline"
				:on-click="signup">
				确定
			</kx-task-button>
			<kx-button
				class="second outline"
				@click="switchPanel">
				登录
			</kx-button>
		</div>
	</base-login-form>
</template>

<script>
import api from "../../api";
import { errorMessage } from "../../utils";
import BaseLoginForm from "./BaseLoginForm";
import { REFRESH_USER } from "../../store/types";

export default {
	name: "SignupPanel",
	components: {
		BaseLoginForm,
	},
	props: {
		returnUri: String,
	},
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
				this.$router.push(this.returnUri);
			} catch (e) {
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

<style module lang="less">
.captcha {
	& > img {
		width: 150px;
		height: 40px;
		cursor: pointer;
	}
}

.inputCaptcha {
	width: calc(100% - 150px - 1em);
	margin-right: 1em;
}
</style>
