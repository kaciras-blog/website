<template>
	<label
		:class='$style.fileDropBox'
		@dragover.prevent
		@drop='handleDrop'
		@dragenter='handleDrag'
		@dragleave='handleDrag'
	>
		<slot>
			<span :class='$style.text'>
				Drop files or select
			</span>
		</slot>
		<input
			:class='$style.fileInput'
			name='file'
			type='file'
			:accept='accept'
			:multiple='multiple'
			@change='handleChange'
		/>
	</label>
</template>

<script setup lang='ts'>
import { useCssModule } from "vue";

interface FileDropProps {

	/**
	 * 按 MIME 类型过滤文件，比如 image/*，默认不过滤。
	 */
	accept?: string;

	/**
	 * 是否可以多选，默认 false。
	 */
	multiple?: boolean;
}

interface FileDropEvents {

	/**
	 * 用户拖放、或者通过点击选择了至少一个文件时触发。
	 *
	 * 原始的 change、drop* 事件仍可监听。
	 */
	(event: "select", files: File[]): void;

	/**
	 * 如果出现了错误，或者拖放的对象有不是文件的时候发出该事件。
	 */
	(event: "error", error: Error): void;
}

defineProps<FileDropProps>();
const emit = defineEmits<FileDropEvents>();
const styles = useCssModule();

function handleChange(event: InputEvent) {
	const { files } = event.currentTarget as HTMLInputElement;
	if (files?.length) {
		emit("select", Array.from(files));
	}
}

function handleDrag(event: DragEvent) {
	const el = event.currentTarget as HTMLElement;
	const { clientX, clientY } = event;

	const rect = el.getBoundingClientRect();
	const inside = clientY > rect.top && clientY < rect.bottom &&
		clientX > rect.left && clientX < rect.right;

	el.classList.toggle(styles.dragging, inside);
}

function handleDrop(event: DragEvent) {
	(event.currentTarget as HTMLElement).classList.remove(styles.dragging);
	event.preventDefault();

	const { items } = event.dataTransfer!;
	const files = Array.from(items).map(e => e.getAsFile()).filter(Boolean);

	if (files.length === items.length) {
		emit("select", files as File[]);
	} else {
		emit("error", new Error("Non-file item in the dropped list"));
	}
}
</script>

<style module lang='less'>
.fileDropBox {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	position: relative;
	cursor: pointer;
	border: dashed 5px #ccc;
	transition: .2s;

	&:is(.dragging, :focus-within, :hover) {
		outline: none;
		border-color: #76b3ff;

		& .text { color: #4d89ff; }
	}
}

.text {
	font-size: 2.5em;
	color: #ccc;
	transition: .2s;
	vertical-align: middle;
}

.fileInput {
	position: absolute;
	opacity: 0;
	z-index: -1;
}
</style>
