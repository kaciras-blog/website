<template>
	<main id="login-view">
		<div class="filter-container">
			<component :is="panel" @switch-panel="switchPanel"/>
		</div>
	</main>
</template>

<script>
import LoginPanel from "../components/LoginPanel";
import SignupPanel from "../components/SignupPanel";
import {FullScreen} from "../mixins";

export default {
	name: "Login",
	components: {LoginPanel, SignupPanel},
	mixins: [FullScreen],
	data() {
		return {
			panel: "loginPanel",
		};
	},
	methods: {
		switchPanel(panel) {
			this.panel = panel;
		},
	},
	created() {
		this.$emit("layout-changed", {clazz: "login-header"}, false);
	},

};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

form {
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
</style>

<style lang="less">
@import "../css/ToBeImpoert";

#login-view {
	width: 100%;
	height: 100%;

	background-size: cover;
	background-image: url("../assets/login-bkg.jpg");

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

.login-header {
	& .content {
		color: white;
		background-color: rgba(50, 50, 50, 0.3) !important;
	}
	& #banner, #top-nav::before {
		background: url("../assets/login-bkg.jpg") fixed;
		background-size: cover;
	}
}

.filter-container {
	.glass;
	.glass.blur(4px);

	margin-top: 3rem;
	box-shadow: rgba(0, 0, 0, .6) 0 0 5px 4px;

	&::before {
		background: url("../assets/login-bkg.jpg") fixed;
		background-size: cover;
	}
	@media screen and (min-width: @length-screen-mobile) {
		margin-top: 0;
	}
}
</style>
