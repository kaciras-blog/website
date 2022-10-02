<template>
	<div>
		<h3 :class='$style.padding'>浏览排行</h3>
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
		<p :class='$style.noContent' v-else>加载失败</p>
	</div>
</template>

<script setup lang="ts">
import { articleLink } from "@/common";
import { usePrefetch } from "@/store";

const { hots } = usePrefetch().data;
</script>

<style module lang="less">
@import "../../css/imports";

.noContent {
	text-align: center;
}

.padding {
	border-left: 8px solid @color-primary-light;
	padding-left: 10px;
	padding-top: .2em;
	padding-bottom: .2em;
	line-height: initial;
}
</style>
