<!-- TODO: 这一版的设计以rem长度单位为主，对宽屏不友好，但由于我没有那么宽的屏幕来做调试，所以搞不了 -->
<template>
	<base-page-layout
		:class="$style.container"
		nav-class="login-header"
	>
		<div :class="$style.body">
			<div :class="$style.picture_box">
				<img
					src="@assets/img/LoginPicture.jpg"
					alt="banner"
					:class="$style.picture"
				>
			</div>
			<component :is="activePanel"
				:class="$style.formPanel"
				:return-uri="returnUri"
				@switch-panel="switchPanel"
			/>
		</div>
	</base-page-layout>
</template>

<script>
import LoginPanel from "./LoginForm";
import SignupPanel from "./SignupForm";

export default {
	name: "LoginPage",
	components: {
		LoginPanel,
		SignupPanel,
	},
	data: () => ({
		activePanel: "LoginPanel",
		returnUri: "/",
	}),
	methods: {
		switchPanel(panel) {
			this.activePanel = panel;
		},
	},
	beforeRouteEnter(to, from, next) {
		const param = to.query["return_uri"];
		if (param) {
			return next(vm => vm.returnUri = param);
		}
		const fromPath = from.fullPath;
		if (fromPath.startsWith("/login")) {
			return next(vm => vm.returnUri = this.returnUri);
		}
		next(vm => vm.returnUri = fromPath);
	},
};
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
