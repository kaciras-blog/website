<!-- 等 Suspense 出了看能不能替代 -->
<template>
	<section v-if='loading' :class='$style.loading' :ref='observe'>
		<AtomSpinner/>
		<span :class='$style.loadingText'>评论加载中</span>
	</section>

	<section v-else-if='loadFail' :class='$style.loading'>
		<span :class='$style.failed'>评论加载失败</span>
	</section>

	<section v-else><slot></slot></section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AtomSpinner, useIntersectionHandler } from "@kaciras-blog/uikit";

const props = defineProps(["loadFn"]);

const loading = ref(true);
const loadFail = ref(false);

const observe = useIntersectionHandler(([entry]) => {
	if (!entry.isIntersecting) {
		return;
	}
	props.loadFn()
		.catch(() => loadFail.value = true)
		.finally(() => loading.value = false);
});
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

/* TODO: 错误字体和颜色用得挺多 */
.failed {
	font-size: 16px;
	color: red;
}
</style>
