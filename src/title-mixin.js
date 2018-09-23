function getMetadata (vm) {
	// 组件可以提供一个 `title` 选项
	// 此选项可以是一个字符串或函数
	const { metadata } = vm.$options;
	if (metadata) {
		return typeof metadata === "function" ? metadata.call(vm) : metadata;
	}
}

const serverTitleMixin = {
	created () {
		const meta = getMetadata(this);
		if (meta) {
			this.$ssrContext.title = meta.title;
			this.$ssrContext.meta = meta.meta;
		}
	},
};

const clientTitleMixin = {
	beforeMount () {
		const meta = getMetadata(this);
		if (meta) {
			document.title = meta.title;
			// 关键字和描述就不管了
		}
	},
};

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === "server"
	? serverTitleMixin
	: clientTitleMixin;
