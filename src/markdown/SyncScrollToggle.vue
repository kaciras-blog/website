<script>
export default {
	name: "SyncScrollToggle",
	functional: true,
	render(createElement, context) {
		const { isSyncScroll, setSyncScroll } = context.props.ctx;
		const { $style } = context;

		if (isSyncScroll) {
			const attrs = {
				staticClass: `${$style.element} ${$style.on}`,
				on: { click: () => setSyncScroll(false) },
			};
			return createElement("span", attrs, "同步滚动开");
		} else {
			const attrs = {
				staticClass: `${$style.element} ${$style.off}`,
				on: { click: () => setSyncScroll(true) },
			};
			return createElement("span", attrs, "同步滚动关");
		}
	},
};
</script>

<style module lang="less">
.element {
	cursor: pointer;
	user-select: none;
	margin-left: .5em;
}

.on {
	color: #00ee3c;
}

.off {
	color: #ff7070;
}
</style>
