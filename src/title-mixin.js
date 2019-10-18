/*
 * meta 由服务端注入，在客户端预载中并不关心这个字段，这也意味着客户端无法改变它。
 * 目前仅用来注入些SEO相关的信息，即便留到其它的页面也不会影响用户体验。
 */
const serverTitleMixin = {
	created () {
		let { title, metadata } = this.$options;

		if (typeof title === "function") {
			title = title.call(this);
		}
		if (typeof metadata === "function") {
			metadata = metadata.call(this);
		}
		if (title) {
			this.$ssrContext.title = title + " - Kaciras的博客";
		}
		if (metadata) {
			this.$ssrContext.meta = metadata;
		}
	},
};

const clientTitleMixin = {
	beforeMount () {
		let { title } = this.$options; // 关键字和描述就不管了

		if (typeof title === "function") {
			title = title.call(this);
		}
		if (title) {
			document.title = title + " - Kaciras的博客";
		}
	},
};

export default process.env.VUE_ENV === "server"
	? serverTitleMixin
	: clientTitleMixin;
