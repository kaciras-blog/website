<template>
<framework background="/static/img/login-bkg.jpg"
		   background-attach="fixed"
		   :show-footer="false">
	<main id="login-view">
		<div class="filter-container">
			<component :is="panel" @switch-panel="switchPanel"></component>
		</div>
	</main>
</framework>
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
		this.$store.commit("setNavBackground", {showBanner: false, url: "/static/img/login-bkg.jpg"});
	},

};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

#login-view {
	width: 100%;
	height: 100%;

	background-size: cover;
	background-image: url("/static/img/login-bkg.jpg");

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

.filter-container{
	.glass;
	.glass.blur(4px);

	box-shadow: rgba(50, 50, 50, .6) 0 0 5px 2px;

	&::before {
		background: url("/static/img/login-bkg.jpg") fixed;
		background-size: cover;
	}
}

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
