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
			const { start, keyExtractor, pageSize, items} = this;
			if(!this.urlTemplate) {
				return null;
			}
			return this.urlTemplate(start + keyExtractor(items), pageSize);
		},
	},
	methods: {
		loadPage(task) {
			const { start, keyExtractor, pageSize, items} = this;
			this.loader(start + keyExtractor(items), pageSize)
				.then(loaded => {
					this.items.push.apply(this.items, loaded);
					task.complete(loaded.length < pageSize);
				})
				.catch(() => task.error());
		},
	},
};
</script>
