<template>
<kx-base-dialog :close-icon="false">
	<h3 slot="title">请输入一些信息</h3>
	<form id="result">
		<label>您的名字</label>
		<input v-model="name" placeholder="某某某"/>

		<label>年龄</label>
		<input type="number" v-model="age" value="0"/>

		<button type="button" @click="ok">确定</button>
	</form>
</kx-base-dialog>
</template>

<script>
export default {
	name: "InputBox",
	props: ["data"],
	data () {
		return Object.assign({
			name: "",
			age: "18",
		}, this.data);
	},
	methods: {
		async ok () {
			let num = parseInt(this.age);
			if (Number.isNaN(num)) {
				await this.$dialog.messageBox("输入错误", "您输入的年龄不是数字", "error");
				this.age = "18";
			}
			if (this.name.length === 0) {
				this.name = "某某某";
			}
			this.$dialog.close(this.$data);
		},
	},
};
</script>

<style lang="less">
#result {
	display: grid;
	grid-template-rows: auto auto auto;
	grid-template-columns: auto 1fr;
	grid-gap: 1rem;

	& > label {
		justify-self: right;
		grid-column-start: 1;
	}
	& > input {
		grid-column-start: 2;
	}
	& > button {
		grid-column: ~"1/3";
	}
}
</style>
