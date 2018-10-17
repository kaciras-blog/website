<template>
	<article>
		<header class="segment" :class="$style.title">
			<h1>{{value.title}}</h1>
			<p><span>发布时间：</span><time>{{value.create}}</time></p>
			<p><span>最后更新：</span><time>{{value.update}}</time></p>
			<div>
				<span>关键词：</span>
				<span v-for="kw in value.keywords"
					  :key="kw"
					  :class="$style.keyword">{{kw}}
				</span>
			</div>
		</header>
		<div class="markdown segment" v-html="html"></div>
	</article>
</template>

<script>
import KxMarkdown from "../../markdown/index";

export default {
	name: "ArticleView",
	props: {
		value: Object,
	},
	computed:{
		// 过滤器不支持v-html
		html () {
			return KxMarkdown.renderHtml(this.value.content);
		},
	},
	mounted () {
		KxMarkdown.afterConvert();
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.title {
	text-align: center;
	& > h1 {
		font-size: 2rem;
	}
}

.keyword {
	margin-right: .3em;
}
</style>
