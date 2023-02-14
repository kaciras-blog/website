<template>
	<ol v-if='hots' class='rank-list'>

		<!-- 这里要保持 <a> 的链接，不能直接把 <RouterLink> 搞成 <li> -->
		<li
			v-for='article of hots'
			:key='article.id'
		>
			<RouterLink
				:to='articleLink(article)'
				class='item'
			>
				{{ article.title }}
			</RouterLink>
		</li>
	</ol>
	<p v-else :class='$style.noContent'>加载失败</p>
</template>

<script setup lang="ts">
import { articleLink } from "@/common";
import { usePrefetch } from "@/store";

const { hots } = usePrefetch().data;
</script>

<style module lang="less">
.noContent {
	text-align: center;
}
</style>
