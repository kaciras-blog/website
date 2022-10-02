<template>
	<KxBaseDialog title='添加链接'>
		<form :class='$style.form' @keyup.enter='ok'>
			<label>链接地址</label>
			<input
				v-model='data.href'
				title='链接地址'
				:class='$style.input'
				placeholder='地址不能为空'
				required
				v-autofocus
			/>

			<label>文字</label>
			<input
				v-model='data.text'
				title='文字'
				:class='$style.input'
				:placeholder='data.href'
			/>
		</form>
		<KxDialogButtons @accept='ok' @cancel='dialog.close'/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { KxBaseDialog, KxDialogButtons, useDialog } from "@kaciras-blog/uikit";

const dialog = useDialog();

const data = reactive({
	text: "",
	href: "",
});

function ok() {
	if (!data.href) {
		return dialog.close();
	}
	if (!data.text) {
		data.text = data.href;
	}
	dialog.confirm(data);
}
</script>

<style module lang="less">
.input {
	width: 24rem;
	margin-top: .3em;
	margin-bottom: 1em;
}

.input:last-child {
	margin-bottom: .5em;
}

.form {
	display: flex;
	flex-direction: column;
}
</style>
