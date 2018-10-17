<template>
	<page-layout
		view-id="login-view"
		class="login-header dark"
		:footer="false">

		<div class="filter-container">
			<component :is="panel" class="login-form" @switch-panel="switchPanel"/>
		</div>
	</page-layout>
</template>

<script>
import LoginPanel from "./LoginForm";
import SignupPanel from "./SignupForm";

export default {
	name: "LoginPage",
	components: { LoginPanel, SignupPanel },
	data: () => ({
		panel: "loginPanel",
	}),
	methods: {
		switchPanel (panel) {
			this.panel = panel;
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

#login-view {
	width: 100%;
	height: 100vh;

	background-size: cover;
	background-image: url("../../assets/login-bkg.jpg");

	@media screen {
		@media (min-width: @length-screen-mobile) {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		@media (min-width: @length-screen-pad) {
			justify-content: flex-end;
			padding: 0 10%;
		}
		@media (min-width: @length-screen-wide) {
			padding: 0 13%;
		}
	}
}

.login-form {
	position: relative;
	color: #fffafa;
	background-color: rgba(50, 50, 50, 0.3);

	::-webkit-input-placeholder {
		color: rgba(255, 250, 250, 0.70);
	}
	:-ms-input-placeholder {
		color: rgba(255, 250, 250, 0.70);
	}

	padding: 1rem 2rem 2rem;

	@media screen and (min-width: @length-screen-mobile) {
		width: 25rem;
		padding-top: 2rem;
	}
}

.login-header {
	& .content {
		color: white;
		background-color: rgba(50, 50, 50, 0.3) !important;
	}
	--background: url("../../assets/login-bkg.jpg") fixed;
	--background-size: cover;
}

.filter-container {
	.glass;
	.glass.blur(4px);

	margin-top: 3rem;
	box-shadow: rgba(0, 0, 0, .6) 0 0 4px 3px;

	&::before {
		background: url("../../assets/login-bkg.jpg") fixed;
		background-size: cover;
	}
	@media screen and (min-width: @length-screen-mobile) {
		margin-top: 0;
	}
}
</style>
