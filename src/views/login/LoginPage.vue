<template>
	<page-layout
		view-id="login-view"
		nav-class="login-header"
		:footer="false">

		<div :class="$style.pictureBox">
			<img :class="$style.picture" src="../../assets/img/LoginPicture.jpg" alt="占位置的图片。。。">
		</div>
		<component :is="activePanel"
				   :class="$style.formPanel"
				   :return-uri="returnUri"
				   @switch-panel="switchPanel"/>
	</page-layout>
</template>

<script>
import LoginPanel from "./LoginForm";
import SignupPanel from "./SignupForm";

export default {
	name: "LoginPage",
	components: {
		LoginPanel, SignupPanel,
	},
	data: () => ({
		activePanel: "loginPanel",
		returnUri: "/",
	}),
	methods: {
		switchPanel (panel) {
			this.activePanel = panel;
		},
	},
	beforeRouteEnter (to, from, next) {
		let returnUri = from.fullPath;
		if (returnUri.startsWith("/login")) {
			console.log("踩踩踩踩踩");
		}
		next(vm => vm.returnUri = returnUri);
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

:global(#login-view) {
	display: flex;
	max-width: 980px;

	margin: 0 auto;
	padding-top: 8rem;

	align-items: flex-start;
}

:global(.login-header) {
	& .content {
		color: white;
		background-color: rgba(50, 50, 50, 0.3) !important;
	}
}

.pictureBox {
	position: relative;
	width: 50%;

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
	float: right;
	width: 20rem;
	margin: 0 auto;
}
</style>
