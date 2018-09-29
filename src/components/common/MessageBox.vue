<template>
	<kx-base-dialog
		:dimmer-close="dimmerClose"
		:class="type"
		:closeIcon="true"
		:draggable="true"
		@close-button-clicked="cancel"
		@dimmer-clicked="dimmerClick">

		<h3 slot="title">{{title}}</h3>
		<pre class="kx-msgbox-body">{{message}}</pre>

		<div slot="footer" class="kx-msgbox-buttons">
			<kx-button v-if="cancelable" @click="cancel">取消</kx-button>
			<kx-button @click="ok">确定</kx-button>
		</div>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "MessageBox",
	props: {
		title: String,
		content: [String, Array],
		type: {
			type: String,
			default: "info",
		},
		cancelable: {
			type: Boolean,
			default: false,
		},
		dimmerClose: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		message() {
			if (typeof(this.content) === "string") {
				return this.content;
			}
			return this.content.join("\n");
		},
	},
	methods: {
		ok() {
			this.$dialog.close(true);
		},
		cancel() {
			this.$dialog.close(false);
		},
		dimmerClick() {
			if (this.dimmerClose) {
				this.$dialog.close(false);
			}
		},
	},
};
</script>

<style lang="less">
.kx-msgbox-body {
	margin: 0;
	font-size: 1rem;
	text-align: center;
}

.kx-msgbox-buttons {
	display: flex;
	padding-left: 1rem;
	padding-right: 1rem;

	& > .kx-btn {
		margin: 0 .5rem;
		flex-grow: 1;
	}
}

.warn {
	& .kx-dialog-header {
		color: #333;
		background-color: #f5d72b;
	}
}

.error {
	& .kx-dialog-header {
		background-color: #f55148;
	}
}
</style>
