<!-- 等 Suspense 出了看能不能替代 -->
<template>
	<section v-if="loading" :class="$style.loading">
		<atom-spinner/>
		<span :class="$style.loadingText">评论加载中</span>
	</section>

	<section v-else-if="loadFail" :class="$style.loading">
		<span :class="$style.failed">评论加载失败</span>
	</section>

	<section v-else><slot></slot></section>
</template>

<script>
export default {
	props: {
		loadFn: {
			type: Function,
			required: true,
		},
	},
	data: () => ({
		loading: true,
		loadFail: false,
	}),
	methods: {
		handleIntersect([entry]) {
			if (!entry.isIntersecting) {
				return;
			}
			this.$_observer.disconnect();
			delete this.$_observer;

			this.loadFn()
				.catch(() => this.loadFail = true)
				.finally(() => this.loading = false);
		},
	},
	mounted() {
		this.$_observer = new IntersectionObserver(this.handleIntersect);
		this.$_observer.observe(this.$el);
	},
	unmounted() {
		if (this.$_observer) {
			this.$_observer.disconnect();
		}
	},
};
</script>

<style module lang="less">
.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px 0;
}

.loadingText {
	margin-top: 10px;
	font-size: 16px;
}

// TODO: 错误字体和颜色用得挺多
.failed {
	font-size: 16px;
	color: red;
}
</style>
