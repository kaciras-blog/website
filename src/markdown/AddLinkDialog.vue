<template>
	<kx-dialog :closeIcon="true" @CloseButtonClicked="cancel">
		<h3 slot="title">添加链接</h3>
		<form @keyup.13="ok" @keyup.27="cancel">
			<label>链接地址</label>
			<input title="链接地址"
				   v-model="href"
				   placeholder="地址不能为空"
				   required
				   v-autofocus/>
			<label>文字</label>
			<input title="文字" v-model="text" :placeholder="href"/>
		</form>
		<div slot="footer">
			<button @click="ok">确定</button>
		</div>
	</kx-dialog>
</template>

<script>
export default {
	name: "AddLinkDialog",
	data() {
		return {
			text: "",
			href: "",
		};
	},
	methods: {
		ok() {
			const data = this.$data;
			if (!data.href) {
				return this.$dialog.close();
			}
			if (!data.text) {
				data.text = data.href;
			}
			this.$dialog.close(data);
		},
		cancel() {
			this.$dialog.close();
		},
	},
};
</script>

<style scoped>
input {
	width: 24rem;
	margin-top: .3em;
	margin-bottom: 1em;
}

input:last-child {
	margin-bottom: .5em;
}

form {
	display: flex;
	flex-direction: column;
}

button {
	float: right;
}
</style>
