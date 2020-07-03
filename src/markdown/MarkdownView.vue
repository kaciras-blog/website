<!-- 虽然只有脚本代码，但因为是组件所以用vue文件 -->
<script>
import { initLazyLoading, renderMarkdown } from ".";

export default {
	name: "MarkdownView",
	props: {
		value: {
			type: String,
			required: true,
		},
	},
	render(h) {
		const innerHTML = renderMarkdown(this.value);
		return h("div", { staticClass: "markdown", domProps: { innerHTML } });
	},
	mounted() {
		initLazyLoading(this.$el);
	},
};
</script>
