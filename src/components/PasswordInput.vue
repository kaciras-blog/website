<!-- 可惜没有 :hover-within 标签关联没法高亮 hover -->
<template>
	<div class="input" :class="$style.container">

		<!--suppress HtmlFormInputWithoutLabel 标签在外面 -->
		<input
			:type="visible ? 'text': 'password'"
			:id="inputId"
			:class="$style.input"
			:value="value"
			:placeholder="placeholder"
			:required="required"
			@input="$emit('input', $event.target.value)"
		>

		<i class="fa"
		   :class="[visible ? 'fa-eye' : 'fa-eye-slash', $style.toggle]"
		   @click="visible = !visible"></i>
	</div>
</template>

<script>
export default {
	name: "PasswordInput",
	props: {
		inputId: String, // 用于跟label关联
		required: {},
		placeholder: String,
		value: String,
	},
	data: () => ({
		visible: false,
	}),
};
</script>

<style module lang="less">
.container {
	display: flex;
	padding: 0;
	align-items: baseline;
}

.input, .input:focus-within {
	flex-grow: 1;
	padding-right: 0;
	border: none;
	box-shadow: none !important;
}

.toggle {
	padding: .5em;
	cursor: pointer;
}
</style>
