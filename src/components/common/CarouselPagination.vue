<template>
	<div class="pagination">
		<span class="title">{{items[index].name}}</span>
		<ol class="buttons">
			<li v-for="(_, i) of items"
				:key="i"
				class="item"
				:class="{ active: index === i }"
				@click="handleClick(i)">
			</li>
		</ol>
	</div>
</template>

<script>
export default {
	name: "CarouselPagination",
	props: {
		items: {
			type: Array,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},
	methods: {
		handleClick(i) {
			this.$emit("click", i);
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.pagination {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;

	display: flex;
	align-items: center;
	padding: .8rem;

	pointer-events: none;
	color: white;
	background-color: rgba(0, 0, 0, .5);
}

.title {
	flex-grow: 1;
	.ellipsis;
}

.buttons {
	margin: 0;
	padding: 0;
	word-break: keep-all;
	flex-shrink: 0;
}

.item {
	list-style: none;
	display: inline-block;

	width: 1rem;
	height: 1rem;
	border-radius: .5rem;
	margin: 0 .4rem;

	background-color: white;
	border: solid 2px transparent;

	pointer-events: auto;
	cursor: pointer;
	transition: all .2s;

	&:hover {
		background-color: #5fcdff;
	}

	&.active {
		background-color: #00c0ff;
		border-color: white;
	}
}
</style>
