<template>
	<article class="plate">
		<header class="title segment">
			<span>{{article.title}}</span>
			<p class="metadata">
				<span>首发：{{article.create}}</span>
				<span>最后更新: {{article.update}}</span>
			</p>
			<div class="metadata">关键词：
				<span style="padding: 0 5px" v-for="kw in article.keywords" :key="kw">{{kw}}</span>
			</div>
		</header>
		<div class="markdown tight segment">{{article.content | renderMarkdown}}</div>
	</article>
</template>

<script>
	export default {
		name: "ArticleView",
		props: ["article"],
		methods:{
			renderMarkdown(text) {

			},
		}
	}
</script>

<style scoped>

</style>
