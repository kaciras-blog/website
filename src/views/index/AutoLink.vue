<!--
只有路径的URI渲染为 <router-link>，带有协议、域名的渲染为 <a>。
因为 router-link 会把链接地址视为本站下的，例如 http://foo.bar -> https://localhost/http://foo.bar
 -->
<script>
const re = new RegExp("^https?://");

export default {
	name: "AutoLink",
	functional: true,
	render(h, ctx) {
		const { href } = ctx.props;
		const { data } = ctx;

		if (re.test(href)) {
			data.attrs.href = href;
			return h("a", data, ctx.slots().default);
		}

		data.attrs.to = href;
		return h("router-link", data, ctx.slots().default);
	},
};
</script>

