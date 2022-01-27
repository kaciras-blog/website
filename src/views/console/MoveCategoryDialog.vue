<template>
	<kx-base-dialog v-once title="选择移动方式">
		<button :class="$style.button" @click="$dialog.confirm(false)">
			<span :class="$style.text">仅单个分类</span>
			<img
				title="only current"
				alt="only current"
				:class="$style.image"
				src="@assets/img/category-single.svg"
			>
		</button>
		<button :class="$style.button" @click="$dialog.confirm(true)">
			<span :class="$style.text">包含子树</span>
			<img
				title="include subtree"
				alt="include subtree"
				:class="$style.image"
				src="@assets/img/category-subtree.svg"
			>
		</button>
	</kx-base-dialog>
</template>

<style module lang="less">
.button {
	display: inline-flex;
	flex-direction: column;
	align-items: center;

	margin: 0 20px 20px;
	padding: 20px;

	background: none;
	cursor: pointer;

	&:hover, &:focus {
		box-shadow: 0 0 4px 4px #dcdcdc;
	}
}

.text {
	font-size: 1.25rem;
	margin-bottom: 20px;
}

.image {
	width: 150px;
	height: 150px;
}
</style>
