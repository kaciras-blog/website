<template>
	<article class="plate">
		<header class="title segment">
			<h1>{{title}}</h1>
			<p>
				<span>首发：{{create}}</span>
				<span>最后更新: {{update}}</span>
			</p>
			<div>关键词：
				<span style="padding: 0 5px" v-for="kw in keywords" :key="kw">{{kw}}</span>
			</div>
		</header>
		<div class="markdown segment" v-html="contentHtml"></div>
	</article>
</template>

<script>
import convertor from "../markdown/markdown-convertor";

export default {
	name: "ArticleView",
	props: ["title", "create", "update", "keywords", "content"],
	computed: {
		contentHtml() {
			return convertor.render(this.content);
		},
	},
};
</script>

<style scoped>

</style>
