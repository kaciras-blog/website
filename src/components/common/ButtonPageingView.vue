<template>
	<div>
		<slot :items="items"/>
		<button-pager
			:theme="theme"
			:total-count="total"
			:index="index"
			:page-size="pageSize"
			@load-page="switchPage"/>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "ButtonPageingView",
	props: {
		loader: {
			type: Function, // index, size, cancelToken => { items, total } or items
			required: true,
		},
		start: {
			type: Number,
			default: 0,
		},
		initItems: {
			type: Array,
			default: () =>([]),
		},
		initPageSize: {
			type: Number,
			default: 20,
		},
		initTotalCount: {
			type: Number,
			default: 0,
		},
		theme: String,
	},
	data() {
		return {
			index: this.start,
			pageSize: this.initPageSize,
			items: this.initItems,
			total: this.initTotalCount,
			loading: null,
		};
	},
	methods: {
		loadPage(index) {
			const { pageSize, _loading, loader } = this;
			if (_loading) {
				_loading.cancel();
			}
			const cancelToken = axios.CancelToken.source();
			this._loading = cancelToken;

			return loader(index, pageSize, cancelToken.token).then(res => {
				this.index = index;

				if(Array.isArray(res)) {
					this.items = res;
				} else {
					this.items = res.items;
					this.total = res.total;
				}
			}).finally(() => this._loading = null);
		},
		switchPage(index) {
			this.loadPage(index).then(this.scrollToStart);
		},
		refresh() {
			this.loadPage(this.index);
		},
		switchToLast() {
			const { loadPage, total, pageSize, scrollToEnd } = this;
			loadPage(Math.floor(total / pageSize)).then(scrollToEnd);
		},
		// scroll helper methods
		scrollToStart() {
			// # 窗口高，楼中楼滚到屏幕顶了？
			// this.$nextTick(() => scrollToElementStart(this.$el));
		},
		scrollToEnd() {
			// this.$nextTick(() => scrollToElementEnd(this.$el));
		},
	},
	beforeMount() {
		if(!this.items.length) {
			this.refresh();
		}
	},
};
</script>
