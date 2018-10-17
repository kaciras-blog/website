<template>
	<kx-base-dialog
			@close-button-clicked="close"
			@dimmer-clicked="close">
		<h3 slot="title">算算你的幸运数字</h3>

		<div><span>姓名：</span>{{name}}</div>
		<div><span>年龄：</span>{{age}}</div>

		<span class="tip">(点击背景可以关闭窗口)</span>
		<div slot="footer">
			<button @click="inputDialog">输入信息</button>
			<button @click="luckyNum">计算！</button>
		</div>
	</kx-base-dialog>
</template>

<script>
import InputBox from "./InputBox.vue";

export default {
	name: "LuckyNumber",
	data: () => ({
		name: "未输入",
		age: "0",
		inputed: false,
	}),
	methods: {
		async inputDialog () {
			const data = await this.$dialog.show(InputBox, this.$data);
			this.inputed = true;
			Object.assign(this.$data, data);
		},
		luckyNum () {
			if (!this.inputed) {
				return this.$dialog.messageBox("无法计算", "请先随意输入姓名和年龄", "warn");
			}

			let num = parseInt(this.age);
			const name = this.name;
			for (let i = name.length - 1; i >= 0; i--)
				num += name.charCodeAt(i);

			this.$dialog.messageBox({
				title: "幸运数字",
				content: [
					"点击标题可以拖动↑",
					"",
					"经过详细而周密的计算！",
					"你的幸运数字是：" + (num % 11),
				],
			}).then(this.$dialog.close);
		},
		close () {
			this.$dialog.close();
		},
	},
};
</script>

<style scoped>
.footer {
	margin-top: 1rem;
}

.tip {
	color: #818181;
	font-size: .9em;
}
</style>
