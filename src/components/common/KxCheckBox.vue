<template>
	<label class="check-box"
		   :class="{ 'disabled': disabled }"
		   role="checkbox"
		   :aria-checked="model"
		   :aria-disabled="disabled">

		<input class="check-box-input"
			   v-model="model"
			   :disabled="disabled"
			   type="checkbox"
			   aria-hidden="true"
			   @change="handleChange">

		<span class="check-box-label"><slot/></span>
	</label>
</template>

<script>
export default {
	name: "KxCheckBox",
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed:{
		model: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
	},
	methods: {
		handleChange(event) {
			this.$emit("change", event.target.checked);
		},
	},
};
</script>

<style lang="less">
.check-box {
	display: block;
	position: relative;
	height: 1.6em;
	cursor: pointer;

	&:hover > .check-box-label::before {
		background-color: rgba(255, 255, 255, 0.3);
	}
}

.check-box-input {
	position: absolute;
	opacity: 0;

	&:checked + .check-box-label::before {
		background-color: #2196F3;
		border-color: #2196F3;
	}

	&:checked + .check-box-label::after {
		display: block;
	}
}

.check-box-label {
	position: relative;
	left: .9em;

	&::before, &::after {
		transition: all .15s;
	}

	&::before {
		content: "";
		position: absolute;
		top: -.2em;
		left: -1.9em;
		height: 1.6em;
		width: 1.6em;

		border: 1px solid #dbdbdb;
		border-radius: 4px;
		box-sizing: border-box;
	}

	&::after {
		content: "";
		border: solid white;
		border-width: 0 2px 2px 0;

		position: absolute;
		transform: translateX(-50%) translateY(-50%) rotate(45deg);
		left: -15px;
		top: 7px;
		width: 7px;
		height: 13px;

		display: none;
	}
}
</style>
