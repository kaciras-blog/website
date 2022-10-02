<template>
	<form class='login-form' @keyup.enter='login'>
		<PageMeta title='登录'/>

		<h1 class='center'>登录</h1>

		<label for='name'>用户名:</label>
		<input
			id='name'
			v-model='form.name'
			name='name'
			title='用户名'
			required
			v-autofocus
		>

		<!--suppress XmlInvalidId -->
		<label for='password'>密码:</label>
		<KxPasswordInput
			input-id='password'
			v-model='form.password'
			title='密码'
			required
			name='password'
		/>

		<KxCheckBox
			v-model='form.remember'
			:class='$style.centerElement'
		>
			保持登录
		</KxCheckBox>

		<span class='text-warning center'>
			{{ message }}
		</span>

		<div class='buttons'>
			<KxTaskButton
				type='outline'
				color='primary'
				@click='login'
			>
				确定
			</KxTaskButton>
			<KxButton
				:disabled='true'
				type='outline'
				color='second'
				@click='switchPanel'
			>
				注册
			</KxButton>
		</div>

		<span class='center' :class='$style.separator'>
			第三方登录
		</span>
		<div class='center'>
			<OauthIcon
				endpoint='github'
				icon='@/assets/img/logo-github.svg'
				tip='Github登录'
				:return-uri='returnUri'
			/>
			<OauthIcon
				endpoint='google'
				icon='@/assets/img/logo-google.svg'
				tip='Google登录'
				:return-uri='returnUri'
			/>
		</div>
	</form>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import { KxButton, KxCheckBox, KxPasswordInput, KxTaskButton } from "@kaciras-blog/uikit";
import api from "@/api";
import OauthIcon from "@/components/OauthIcon.vue";
import { errorMessage } from "@/utils";
import { useCurrentUser } from "@/store";
import PageMeta from "@/components/PageMeta";

interface LoginFormProps {
	returnUri: string;
}

const props = defineProps<LoginFormProps>();
const emit = defineEmits(["switch-panel"]);

const user = useCurrentUser();
const router = useRouter();

const form = reactive({
	password: "",
	name: "",
	remember: false,
});

const message = ref("");

async function login() {
	try {
		await api.user.login(toRaw(form));
		await user.refresh();
		await router.push(props.returnUri);
	} catch (e) {
		message.value = errorMessage(e);
	}
}

function switchPanel() {
	emit("switch-panel", "SignupPanel");
}
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
