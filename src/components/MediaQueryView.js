export default {
	name: "MediaQueryView",
	props: {
		// tablet tablet+ tablet-
		media: {
			type: [String, Array],
			required: true,
		},
	},
	render(h, ctx) {
		// 日gou了竟然还非得套个div，到现在Vue都不支持Fragment
		return this.$mediaMatch(this.media) ? h("div", this.$slots.default) : h();
	},
};
