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
			type: Function,
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
	},
	data() {
		return {
			index: this.start,
			pageSize: this.initPageSize,
			items: [],
			total: 0,
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

			return loader(index, pageSize, cancelToken.token).then(({ items, total }) => {
				this.index = index;
				this.items = items;
				this.total = total;
			}).finally(() => this._loading = null);
		},
		switchPage(index) {
			this.loadPage(index).then(() => scrollToElementStart(this.$el));
		},
		refresh() {
			this.loadPage(this.index);
		},
		switchToLast() {
			const { loadPage, total, pageSize, $el } = this;
			loadPage(Math.floor(total / pageSize)).then(() => scrollToElementEnd($el));
		},
	},
	beforeMount() {
		this.refresh();
	},
};
</script>
