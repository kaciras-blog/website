<!--
使用注意：footer插槽最好是一个元素，多个就用容器包起来
-->
<template>
<transition name="fade">
	<div class="kx-dialog-dimmer"
		 @click.self="dimmerClick">

		<div class="kx-dialog"
			 ref="panel"
			 :style="optionalStyle"
			 role="dialog"
			 aria-modal="true">

			<header class="kx-dialog-header"
					@mousedown="drag">

				<slot name="title"/>
				<div title="关闭"
					 class="kx-dialog-close"
					 v-if="closeIcon"
					 @mousedown.stop
					 @click="close">X
				</div>
			</header>

			<div class="kx-dialog-body"><slot/></div>
			<slot name="footer"/>
		</div>
	</div>
</transition>
</template>

<script>
export default {
	name: "KxBaseDialog",
	props: {
		/** 是否显示右上角的关闭按钮（叉） */
		closeIcon: {
			type: Boolean,
			default: true,
		},
		/** 在点击关闭按钮时不发出事件，而是直接关闭窗口并返回undefined */
		defaultClose: {
			type: Boolean,
			default: true,
		},
		/** 是否可以点击标题栏拖动 */
		draggable: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			position: {
				X: 0,
				Y: 0,
				manual: false,
			},
		};
	},
	computed: {
		optionalStyle() {
			const style = {};

			if (this.position.manual) {
				style.position = "fixed";
				style.left = this.position.X + "px";
				style.top = this.position.Y + "px";
			}
			return style;
		},
	},
	methods: {
		dimmerClick() {
			this.$emit("dimmer-clicked");
		},
		close() {
			if (this.defaultClose) {
				this.$dialog.close();
			} else {
				this.$emit("close-button-clicked");
			}
		},
		drag(downEvent) {
			if (!this.draggable) {
				return;
			}
			if (!downEvent.touches && downEvent.button !== 0) {
				return; //鼠标右键不拖动
			}
			const clientRect = this.$refs.panel.getBoundingClientRect();
			this.position.manual = true;

			//按住时窗口的左上角坐标
			const originX = this.position.X = clientRect.left;
			const originY = this.position.Y = clientRect.top;

			//按住时鼠标的坐标
			const startX = downEvent.clientX;
			const startY = downEvent.clientY;

			const onMove = event => {
				const {clientX, clientY} = event.touches && event.touches.length > 0
					? event.touches[0] : event;
				this.position.X = originX + clientX - startX;
				this.position.Y = originY + clientY - startY;
				event.preventDefault();
			};

			const onUp = event => {
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('touchmove', onMove);
				document.removeEventListener('mouseup', onUp);
				document.removeEventListener('touchend', onUp);
				event.preventDefault();
			};

			document.addEventListener('mousemove', onMove);
			document.addEventListener('touchmove', onMove);
			document.addEventListener('mouseup', onUp);
			document.addEventListener('touchend', onUp);
			downEvent.preventDefault();
		},
	},
};
</script>

<style lang="less">
.fade-enter {
	opacity: 0;
}

.fade-enter-active {
	transition: all 0.25s;
}

.kx-dialog-close {
	height: 100%;
	width: 3rem;
	cursor: pointer;
	font-size: 1.5rem;
	text-align: center;
	line-height: 3rem;
	border-top-right-radius: calc(.5rem - 1px);

	&:hover {
		background-color: rgba(0, 0, 0, .15);
	}
}

.kx-dialog-dimmer {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .1);

	display: flex;
	justify-content: center;
	align-items: center;
}

.kx-dialog {
	display: flex;
	flex-direction: column;

	min-width: 16rem;

	border-radius: .5rem;
	background-color: white;
}

.kx-dialog-header {
	height: 3rem;
	color: white;

	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;

	padding-left: 1rem;
	background-color: rgb(51, 149, 231);
	border-top-left-radius: calc(.5rem - 1px);
	border-top-right-radius: calc(.5rem - 1px);

	display: flex;
	justify-content: space-between;
	align-items: center;
}

.kx-dialog-body {
	padding: 1.5rem 1rem;
	border-bottom-left-radius: calc(.5rem - 1px);
	border-bottom-right-radius: calc(.5rem - 1px);
	overflow-y: auto;
	overflow-x: hidden;

	/* footer插槽，如果有就加个下边距 */
	& + * {
		padding-bottom: 1rem;
	}
}
</style>
