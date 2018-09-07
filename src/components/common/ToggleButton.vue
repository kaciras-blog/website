<template>
	<div class="toggle-button">
		<input type="checkbox"
			   :checked="value"
			   @change="change">
		<label></label>
	</div>
</template>

<script>
export default {
	name: "ToggleButton",
	props: ["value"],
	methods: {
		change(event) {
			this.$emit("input", event.target.checked);
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImpoert";

.toggle-button {
	position: relative;
	display: inline-block;

	& > label {
		width: 3rem;
		height: 1rem;
		background: @color-input-slient;
		position: relative;
		display: inline-block;
		border-radius: .5rem;
		transition: 0.25s;

		&::after {
			content: '';
			position: absolute;
			width: 1rem;
			height: 1rem;
			border-radius: 100%;
			left: 0;
			z-index: 2;
			background: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
			transition: 0.25s;
		}
	}

	& > input {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 3;
		opacity: 0;
		cursor: pointer;
	}

	& > input:hover + label::after {
		box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25), 0 2px 1px 0 rgba(0, 0, 0, 0.15);
	}
	& > input:checked + label::after {
		left: 2rem;
	}
	& > input:checked + label {
		background: @color-input-active;
	}
}
</style>
