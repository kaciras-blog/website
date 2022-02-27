<script>
import { h, useCssModule } from "vue";

export default {
	name: "SyncScrollToggle",
	props: ["ctx"],
	render(props) {
		const { isSyncScroll, setSyncScroll } = props.ctx;
		const $style = useCssModule();

		if (isSyncScroll) {
			const attrs = {
				staticClass: `${$style.element} ${$style.on}`,
				on: { click: () => setSyncScroll(false) },
			};
			return h("span", attrs, "同步滚动开");
		} else {
			const attrs = {
				staticClass: `${$style.element} ${$style.off}`,
				on: { click: () => setSyncScroll(true) },
			};
			return h("span", attrs, "同步滚动关");
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
