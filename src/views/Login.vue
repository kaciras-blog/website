<template>
	<main>
		<component :is="panel" @switch-panel="switchPanel"></component>
	</main>
</template>

<script>
	import LoginPanel from "../components/LoginPanel";
	import SignupPanel from "../components/SignupPanel";

	export default {
		name: "Login",
		components: {LoginPanel, SignupPanel},
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
	}
</script>

<style scoped>

</style>
