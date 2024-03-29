<template>
	<form class='login-form' @keyup.enter='signUp'>
		<PageMeta title='注册'/>

		<h1 class='center segment'>注册</h1>

		<label for='name'>用户名:</label>
		<input
			id='name'
			v-model='form.name'
			name='name'
			placeholder='中英文数字和下划线'
			required
			v-autofocus
			autocomplete='username'
		>

		<!--suppress XmlInvalidId -->
		<label for='password'>密码:</label>
		<KxPasswordInput
			input-id='password'
			v-model='form.password'
			name='password'
			required
			title='密码'
			placeholder='至少有个8位'
			autocomplete='new-password'
		/>

		<label for='email'>邮箱:</label>
		<input
			id='email'
			v-model='form.email'
			type='email'
			name='email'
			placeholder='（可选）不填也行'
		>

		<label for='captcha'>验证码:</label>
		<div :class='$style.captcha'>
			<input
				id='captcha'
				ref='captchaInput'
				v-model='form.captcha'
				name='captcha'
				title='验证码'
				:class='$style.inputCaptcha'
				required
			>
			<img
				:src='captcha'
				alt='验证码'
				title='点击换一张'
				@click='updateCaptcha'
			>
		</div>

		<span class='text-warning center'>
			{{ message }}
		</span>

		<div class='buttons'>
			<KxTaskButton
				type='outline'
				color='primary'
				:on-click='signUp'
			>
				确定
			</KxTaskButton>
			<KxButton
				type='outline'
				color='second'
				@click='switchPanel'
			>
				登录
			</KxButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import { KxButton, KxPasswordInput, KxTaskButton } from "@kaciras-blog/uikit";
import api from "@/api/index.ts";
import { errorMessage } from "@/utils.ts";
import { useCurrentUser } from "@/store/index.ts";
import PageMeta from "@/components/PageMeta.ts";

interface LoginFormProps {
	returnUri: string;
}

const props = defineProps<LoginFormProps>();
const emit = defineEmits(["switch-panel"]);

const user = useCurrentUser();
const router = useRouter();

const form = reactive({
	name: "",
	password: "",
	email: "",
	captcha: "",
});

const captcha = ref<string | null>(null);
const message = ref("");
const captchaInput = ref<HTMLInputElement>();

async function signUp() {
	try {
		await api.user.signup(toRaw(form));
		await user.refresh();
		await router.push(props.returnUri);
	} catch (e) {
		message.value = errorMessage(e);
	}
}

function switchPanel() {
	emit("switch-panel", "LoginPanel");
}

function updateCaptcha() {
	captcha.value = api.user.captchaAddress();
	form.captcha = "";
	captchaInput.value!.focus();
}

onMounted(() => captcha.value = api.user.captchaAddress());
</script>

<style module lang="less">
.captcha > img {
	vertical-align: middle;
	width: 150px;
	height: 40px;
	cursor: pointer;
}

.inputCaptcha {
	width: calc(100% - 150px - 1em);
	margin-right: 1em;
}
</style>
