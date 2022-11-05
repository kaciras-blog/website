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
			name="file"
			type="file"
			:accept='accept'
			:multiple='multiple'
			@click='$emit("selectStart")'
			@change='handleChange'
		/>
	</label>
</template>

<script setup lang='ts'>
import { useCssModule } from "vue";

interface FileDropProps {
	accept?: string;
	multiple?: boolean;
}

interface FileDropEvents {
	selectStart: () => void;
	select: (files: File[]) => void;
	error: (error: Error) => void;
}

defineProps<FileDropProps>();
const emit = defineEmits<FileDropEvents>();
const styles = useCssModule();

function handleChange(event: InputEvent) {
	const { files } = event.currentTarget as HTMLInputElement;
	if (files?.length) {
		emit("change", Array.from(files));
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
		emit("change", files as File[]);
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

	&.dragging,
	&:focus-within,
	&:hover {
		outline: none;
		border-color: #76b3ff;

		& .text {
			color: #4d89ff;
		}

		& .icon {
			color: #da76ff;
		}
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
