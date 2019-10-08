<!-- 虽然只有脚本代码，但因为是组件所以用vue文件 -->
<script>
import KxMarkdown from ".";

export default {
	name: "MarkdownView",
	props: {
		value: { type: String, required: true },
	},
	render(h) {
		const innerHTML = KxMarkdown.renderHtml(this.value);
		return h("div", { staticClass: "markdown", domProps: { innerHTML } });
	},
	mounted() {
		KxMarkdown.afterConvert(this.$el);
	},
};
</script>
