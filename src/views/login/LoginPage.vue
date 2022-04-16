<!-- TODO: 这一版的设计以rem长度单位为主，对宽屏不友好，但由于我没有那么宽的屏幕来做调试，所以搞不了 -->
<template>
	<BasePageLayout nav-class="login-header">
		<PageMeta :body-class="$style.container"/>

		<div :class="$style.body">
			<div :class="$style.picture_box">
				<img
					src="@/assets/img/LoginPicture.jpg"
					alt="banner"
					:class="$style.picture"
				>
			</div>
			<component
				:is="activePanel"
				:class="$style.formPanel"
				:return-uri="returnUri"
				@switch-panel="switchPanel"
			/>
		</div>
	</BasePageLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

/**
 * 将前一个页面的地址记录到 returnUri 属性中，以便登陆后返回。
 *
 * vue-router 这个傻逼东西的 next 参数没泛型，导致 returnUri 标错，不影响构建。
 */
export default defineComponent({
	beforeRouteEnter(to, from, next) {
		const param = to.query.return_uri;
		if (param) {
			return next(vm => vm.returnUri = param);
		}
		const fromPath = from.fullPath;
		if (fromPath.startsWith("/login")) {
			return next(vm => vm.returnUri = this.returnUri);
		}
		next(vm => vm.returnUri = fromPath);
	},
});
</script>

<script setup lang="ts">
import { shallowRef } from "vue";
import BasePageLayout from "@/components/BasePageLayout.vue";
import SignupForm from "./SignupForm.vue";
import LoginForm from "./LoginForm.vue";
import PageMeta from "@/components/PageMeta";

// 这里用 Component 类型会报错，可能是 Vue 的 BUG。
const activePanel = shallowRef<any>(LoginForm);
const returnUri = shallowRef("/");

defineExpose({ returnUri });

function switchPanel(name: string) {
	if (name === "LoginPanel") {
		activePanel.value = LoginForm;
	} else {
		activePanel.value = SignupForm;
	}
}
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

:global(.login-header) {
	& .content {
		color: white;
		background-color: rgba(50, 50, 50, 0.3) !important;
	}
}

.body {
	display: flex;
	align-items: flex-start;

	flex: 1;

	max-width: 980px;
	margin: 0 auto;
	padding: 40px 0 40px 0;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 80px 0 50px 0;
	}
}

.picture_box {
	position: relative;
	width: 50%;
	padding: 0 20px;

	@media (max-width: @length-screen-mobile) {
		display: none;
	}

	&::after {
		content: "";
		position: absolute;
		top: -2rem;
		bottom: 0;
		right: 0;
		width: 1px;

		background-image: -webkit-linear-gradient(top, #fff, #d5d5d5 10%, #d5d5d5 90%, #fff 100%);
	}
}

.picture {
	max-width: 100%;
}

.formPanel {
	width: 20rem;
	margin: 0 auto;
}
</style>

<style lang="less">
.login-form {
	display: grid;
	grid-template-columns: 4em 1fr;
	grid-column-gap: .5em;
	grid-row-gap: 1em;

	& > label {
		align-self: center;
		justify-self: right;

		& + input {
			grid-column-start: 2;
		}
	}

	& > .center {
		text-align: center;
		grid-column: ~"1/3";
	}

	& > .text-warning {
		font-size: 1rem;
		color: #ff4d52;
	}

	& > .buttons {
		grid-column: ~"1/3";
		display: flex;

		& > * {
			flex: 1;
		}

		& > *:not(:last-child) {
			margin-right: 1rem;
		}
	}
}
</style>
