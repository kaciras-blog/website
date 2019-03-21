<template>
	<kx-base-dialog title="添加链接">
		<form :class="$style.form" @keyup.13="ok">
			<label>链接地址</label>
			<input title="链接地址"
				   :class="$style.input"
				   v-model="href"
				   placeholder="地址不能为空"
				   required
				   v-autofocus/>

			<label>文字</label>
			<input title="文字"
				   :class="$style.input"
				   v-model="text"
				   :placeholder="href"/>
		</form>
		<kx-standard-dialog-buttons @confirm="ok"/>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "AddLinkDialog",
	data: () => ({
		text: "",
		href: "",
	}),
	methods: {
		ok () {
			const data = this.$data;
			if (!data.href) {
				return this.$dialog.close();
			}
			if (!data.text) {
				data.text = data.href;
			}
			this.$dialog.confirm(data);
		},
		cancel () {
			this.$dialog.close();
		},
	},
};
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

.footer {
	padding-left: 1rem;
	padding-right: 1rem;
}

.button {
	width: 100%;
}
</style>
