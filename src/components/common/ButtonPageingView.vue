<template>
	<div>
		<slot v-for="item of items" :item="item"/>
		<button-pager
			:total-count="total"
			:index="index"
			:page-size="pageSize"
			@load-page="switchPage"/>
	</div>
</template>

<script>
import axios from "axios";
import { scrollToElementStart, scrollToElementEnd } from "../../utils";

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
		initPageSize: {
			type: Number,
			default: 2,
		},
		initTotalCount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			index: this.start,
			pageSize: this.initPageSize,
			items: [],
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

				if(typeof res === "object") {
					this.items = res.items;
					this.total = res.total;
				} else if(Array.isArray(res)) {
					this.items = res;
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
			this.$nextTick(() => scrollToElementStart(this.$el));
		},
		scrollToEnd() {
			this.$nextTick(() => scrollToElementEnd(this.$el));
		},
	},
	beforeMount() {
		this.refresh();
	},
};
</script>
