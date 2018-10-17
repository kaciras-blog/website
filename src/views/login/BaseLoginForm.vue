<template functional>
	<form class="login-form" @keyup.13="listeners.ok">
		<slot/>
		<div class="buttons">
			<slot name="button"/>
		</div>
	</form>
</template>

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
		font-size: 1.2em;
		font-weight: 600;
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
