<!--
该组件将使用相对路径（以/开头的）URI 渲染为 <router-link>，其他情况渲染为 <a>。
解决 router-link 会把链接地址视为本站下的问题，例如 http://foo.bar -> https://localhost/http://foo.bar
 -->
<script>
export default {
	name: "AutoLink",
	functional: true,
	render(h, ctx) {
		const { href } = ctx.props;
		const { data } = ctx;

		if (href && href[0] === "/") {
			data.attrs.to = href;
			return h("router-link", data, ctx.slots().default);
		}

		data.attrs.href = href;
		return h("a", data, ctx.slots().default);
	},
};
</script>
