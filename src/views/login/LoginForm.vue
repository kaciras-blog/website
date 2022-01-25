<template>
	<form class="login-form" @keyup.enter="login">
		<h1 class="center segment">登录</h1>

		<label for="name">用户名:</label>
		<input
			id="name"
			v-model="form.name"
			name="name"
			title="用户名"
			required
			v-autofocus
		>

		<label for="password">密码:</label>
		<kx-password-input
			input-id="password"
			v-model="form.password"
			name="password"
			required
			title="密码"
		/>

		<kx-check-box
			v-model="form.remember"
			:class="$style.centerElement"
		>
			保持登录
		</kx-check-box>

		<span class="text-warning center">{{message}}</span>

		<div class="buttons">
			<kx-task-button
				class="primary outline"
				:on-click="login"
			>
				确定
			</kx-task-button>
			<kx-button
				class="second outline"
				@click="switchPanel"
			>
				注册
			</kx-button>
		</div>

		<span class="center" :class="$style.separator">第三方登录</span>
		<div class="center">
			<oauth-icon
				endpoint="github"
				icon="logo-github.svg"
				tip="Github登录"
				:return-uri="returnUri"
			/>
			<oauth-icon
				endpoint="google"
				icon="logo-google.svg"
				tip="Google登录"
				:return-uri="returnUri"
			/>
		</div>
	</form>
</template>

<script>
import api from "@/api";
import { errorMessage } from "@/utils";
import { REFRESH_USER } from "@/store/types";
import OauthIcon from "@/components/OauthIcon.vue";

export default {
	name: "LoginPanel",
	components: {
		OauthIcon,
	},
	props: {
		returnUri: String,
	},
	data: () => ({
		message: "",
		form: {
			password: "",
			name: "",
			remember: false,
		},
	}),
	methods: {
		async login(event) {
			event.stopPropagation();

			try {
				await api.user.login(this.form);
				await this.$store.dispatch(REFRESH_USER);
				await this.$router.push(this.returnUri);
			} catch (e) {
				this.message = errorMessage(e);
			}
		},
		switchPanel() {
			this.$emit("switch-panel", "SignupPanel");
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.separator {
	position: relative;
	color: #747474;
	margin-top: .5rem;

	&::before, &::after {
		content: "";
		position: absolute;
		background-color: @color-border;
		height: 1px;
		top: 50%;
		width: 30%;
	}

	&::before {
		right: 0;
	}

	&::after {
		left: 0;
	}
}

.centerElement {
	grid-column: ~"1/3";
	justify-self: center !important;
}
</style>
