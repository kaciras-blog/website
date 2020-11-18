<!-- 虽然只有脚本代码，但因为是组件所以用vue文件 -->
<script>
import { articleRenderer, discussionRenderer, initLazyLoading } from ".";

export default {
	name: "MarkdownView",
	props: {
		value: {
			type: String,
			required: true,
		},
		isArticle: {
			type: Boolean,
			default: false,
		},
	},
	render(h) {
		const renderer = this.isArticle ? articleRenderer : discussionRenderer;
		const innerHTML = renderer.render(this.value);
		return h("div", { staticClass: "markdown", domProps: { innerHTML } });
	},
	async mounted() {
		await this.$nextTick();
		this.$_disconnect = initLazyLoading(this.$el);
	},
	destroyed() {
		this.$_disconnect();
	},
};
</script>
