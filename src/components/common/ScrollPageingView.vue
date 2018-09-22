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
			type: Function, // items, pageSize -> nextUrl
			required: true,
		},
		initItems: {
			type: Array,
			default: () => [],
		},
		pageSize: {
			type: Number,
			default: 2,
		},
	},
	data() {
		// 复制一份避免影响到父组件的状态
		return {
			items: this.initItems.slice(),
			nextPageUrl: null,
		};
	},
	methods: {
		async loadPage(task) {
			const { loader, items, pageSize } = this;

			try {
				const oldLength = items.length;
				this.nextPageUrl = await loader(items, pageSize);
				task.complete(items.length - oldLength < pageSize);
			} catch (err) {
				task.error(err);
			}
		},
	},
};
</script>
