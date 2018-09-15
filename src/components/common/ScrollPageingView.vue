<template>
	<div>
		<slot v-for="item of items" :item="item"/>
		<scroll-pager :next-page-url="nextPageUrl" @load-page="loadPage"/>
	</div>
</template>

<script>
export default {
	name: "ScrollPageingView",
	props: {
		loader: {
			type: Function,
			required: true,
		},
		start: {
			type: Number,
			default: 0,
		},
		pageSize: {
			type: Number,
			default: 16,
		},
		keyExtractor: {
			type: Function,
			default: items => items.length,
		},
		urlTemplate:{
			type: Function,
			required: false,
		},
	},
	data: () => ({
		items: [],
	}),
	computed:{
		nextPageUrl() {
			if(!this.urlTemplate) {
				return null;
			}
			const index = this.start + this.keyExtractor(this.items);
			return this.urlTemplate(index, this.pageSize);
		},
	},
	methods: {
		loadPage(task) {
			const index = this.start + this.keyExtractor(this.items);
			this.loader(index, this.pageSize)
				.then(items => {
					this.items.push.apply(this.items, items);
					task.complete(items.length < this.pageSize);
				})
				.catch(task.error);
		},
	},
};
</script>
