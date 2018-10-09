<template>
	<label class="kx-check-box"
		   :class="{ disabled }"
		   role="checkbox"
		   :aria-checked="model"
		   :aria-disabled="disabled">

		<input class="check-box-input"
			   type="checkbox"
			   :disabled="disabled"
			   v-model="model"
			   aria-hidden="true"
			   @change="handleChange">

		<span class="check-box-mark" :class="{ ckecked: model }"></span>

		<span class="check-box-label"><slot/></span>
	</label>
</template>

<script>
export default {
	name: "KxCheckBox",
	props: {
		// 可能没有设置，使用undefined区分
		value: {
			type: Boolean,
			default: undefined,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		selfValue: false,
	}),
	computed: {
		model: {
			get() {
				return typeof this.value === "undefined" ? this.selfValue : this.value;
			},
			set(value) {
				this.selfValue = value;
				this.$emit("input", value);
			},
		},
	},
	methods: {
		handleChange(event) {
			this.$emit("changed", event.target.checked);
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

.kx-check-box {
	display: block;
	height: 1.6em;
	cursor: pointer;
}

.kx-check-box:hover > .check-box-mark,
.check-box-input:focus + .check-box-mark {
	@color: fade(@color-primary, 50%);
	box-shadow: 0 0 0 .25rem @color;
}

.check-box-input {
	position: absolute;
	opacity: 0;
}

.check-box-mark {
	display: inline-block;
	position: relative;
	height: 1.6em;
	width: 1.6em;
	vertical-align: top;

	border: 1px solid #dbdbdb;
	border-radius: 4px;

	transition: all .15s;

	&::after {
		content: "";
		border: solid white;
		border-width: 0 2px 2px 0;
		position: absolute;

		transform: translateX(-50%) translateY(-50%) rotate(45deg);
		left: 10px;
		top: 9px;
		width: 7px;
		height: 13px;

		display: none;
	}

	&.ckecked {
		background-color: #2196F3;
		border-color: #2196F3;
	}
	&.ckecked::after {
		display: block;
	}
}

.check-box-label {
	display: inline-block;
	padding-left: .5rem;
	padding-top: 1px; // 微调下上边距跟勾对齐
	line-height: 19px;
}
</style>
