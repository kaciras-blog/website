<template>
	<div v-if="loading" :class="$style.loading">
		<atom-spinner
			:animation-duration="1200"
			:size="64"
			color="#33aaff"
		/>
		<span :class="$style.loadingText">评论加载中</span>
	</div>

	<div v-else-if="loadFail" :class="$style.loading">
		<span :class="$style.failed">评论加载失败</span>
	</div>

	<div v-else><slot></slot></div>
</template>

<script>
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";

export default {
	components: {
		AtomSpinner,
	},
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
		}
	},
	mounted() {
		this.$_observer = new IntersectionObserver(this.handleIntersect);
		this.$_observer.observe(this.$el);
	},
	destroyed() {
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
