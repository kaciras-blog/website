<template>
	<div>
		<slot :items="items"/>
		<scroll-pager
			:init-state="initState"
			:next-page-url="nextPageUrl"
			@load-page="loadPage"/>
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
		pageSize: {
			type: Number,
			default: 16,
		},
		// 下面两个设置初始状态，可以用于预渲染
		initItems: {
			type: Array,
			default: () => [],
		},
		initNextUrl: String,
		initState: String,
	},
	data () {
		return {
			items: this.initItems.slice(), // 复制一份避免影响到父组件的状态
			nextPageUrl: this.initNextUrl,
		};
	},
	methods: {
		async loadPage (task) {
			const { loader, items, pageSize } = this;

			try {
				const oldLength = items.length;
				this.nextPageUrl = await loader(items, pageSize);
				task.complete(items.length - oldLength < pageSize);
			} catch (err) {
				task.completeWithError(err);
			}
		},
	},
};
</script>
