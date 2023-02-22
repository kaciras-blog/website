<template>
	<fieldset :class='$style.container'>
		<!-- legend 布局有 BUG，暂不用 -->
		显示大小
		<input
			:class='$style.size'
			type='number'
			min='1'
			:value='width'
			@input='handleInputW'
		>
		x
		<input
			:class='$style.size'
			type='number'
			min='1'
			:value='height'
			@input='handleInputH'
		>

		<KxButton
			title='保持宽高比'
			type='icon'
			:class='locked && $style.locked'
			@click='toggleLocked'
		>
			<LinkIcon/>
		</KxButton>
	</fieldset>
</template>

<script setup lang='ts'>
import { shallowRef } from "vue";
import LinkIcon from "bootstrap-icons/icons/link-45deg.svg?sfc";
import { KxButton } from "@kaciras-blog/uikit";

/*
 * 一旦将宽高状态放到外面，则无法区分它们是从内部还是外部改变的，
 * 进而无法确定是否需要更新宽高比，只能由外部传入了。
 */
interface Size2DProps {
	width: number;
	height: number;
	aspectRatio: number;
}

interface Size2DEvents {

	(event: "update:width", value: number): void;

	(event: "update:height", value: number): void;
}

const props = defineProps<Size2DProps>();
const emit = defineEmits<Size2DEvents>();

const locked = shallowRef(true);

function toggleLocked() {
	locked.value = !locked.value;
	const height = props.width / props.aspectRatio;
	emit("update:height", Math.round(height));
}

function handleInputW(event: InputEvent) {
	let { valueAsNumber } = event.target as HTMLInputElement;

	if (locked.value) {
		const h = valueAsNumber / props.aspectRatio;
		emit("update:height", Math.round(h));
	}
	emit("update:width", valueAsNumber);
}

function handleInputH(event: InputEvent) {
	let { valueAsNumber } = event.target as HTMLInputElement;

	if (locked.value) {
		const w = valueAsNumber * props.aspectRatio;
		emit("update:width", Math.round(w));
	}
	emit("update:height", valueAsNumber);
}
</script>

<style module lang='less'>
@import "../css/imports";

.container {
	display: flex;
	align-items: center;
	gap: 10px;
}

.size {
	width: 7em;
	flex: 1;
}

.locked {
	color: @color-primary;
	background: #eee;
	box-shadow: inset 0 0 4px #bbb;
}
</style>
