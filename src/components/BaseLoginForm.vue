<template>
	<form class="login-form" @keyup.13="ok">
		<slot/>
		<div class="buttons"><slot name="button"/></div>
	</form>
</template>

<script>
export default {
	name: "BaseLoginForm",
	methods: {
		ok() { this.$emit("ok"); },
	},
};
</script>

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
		height: 1em;
		font-size: 1.1em;
		color: #ff767b;
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
