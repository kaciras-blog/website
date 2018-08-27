<template>
	<kx-dialog :closeIcon="true" @keyup.27="cancel">
		<span slot="title"><i class="fa fa-link"></i>添加链接</span>
		<form class="flex vertical" @keyup.13="ok">
			<label>文字</label>
			<input title="文字" v-model="form.text" :placeholder="form.href"/>
			<label>链接地址</label>
			<input title="链接地址" v-model="form.href" placeholder="地址不能为空" required/>
		</form>
		<button slot="footer-right" class="square" @click="ok">确定</button>
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
		cancel() { this.$dialog.close(); },
	},
};
</script>

<style scoped>
	input{
		width: 24rem;
		margin-top: .3em;
		margin-bottom: 1em;
	}
	input:last-child {
		margin-bottom: .5em;
	}
</style>
