<template>
	<div class="pagination">
		<span></span>
		<ol>
			<li v-for="(_, i) of items"
				:key="i"
				class="item"
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
	},
	methods: {
		handleClick(i) {
			this.$emit("click", i);
		},
	},
};
</script>

<style scoped>
.pagination {
	position: absolute;
	right: 0;
	bottom: 0;
}

.item {

}
</style>
