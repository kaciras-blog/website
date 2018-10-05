<script>
import KxButton from "./KxButton";

function contentOf(type, index) {
	switch (type) {
		case "FIRST":
			return "首页";
		case "PREV":
			return "上一页";
		case "NEXT":
			return "下一页";
		case "LAST":
			return "尾页";
		case "OMIT":
			return "...";
		default:
			return index; // JUMP, CURRENT
	}
}

function textButton(createElement, type, index) {
	if (type === "OMIT") {
		return createElement("span", { attrs: { "class": "omit" } }, "...");
	}
	const content = contentOf(type, index);
	if (type === "CURRENT") {
		return createElement("span", { attrs: { "class": "active" } }, content);
	}
	return createElement("a", {
		attrs: {
			"class": "text-link",
			tabIndex: 0,
		},
		on: { click: () => this.showPage(index) },
	}, content);
}

function simpleButton(createElement, type, index) {
	if (type === "OMIT") {
		return createElement("span", { attrs: { "class": "omit" } }, "...");
	}
	const content = contentOf(type, index);
	if (type === "CURRENT") {
		return createElement(KxButton, { attrs: { "class": "primary" } }, content);
	}
	return createElement(KxButton, { on: { click: () => this.showPage(index) } }, content);
}

export default {
	name: "ButtonPager",
	props: {
		index: {
			type: Number,
			required: true,
		},
		totalCount: {
			type: Number,
			required: true,
		},
		pageSize: {
			type: Number,
			default: 20,
		},
		/**
		 * 省略起始位置，在当前页面按钮左右omitPos之内
		 * 的页面将显示为按钮，超出的显示省略号。
		 */
		omitPos: {
			type: Number,
			default: 2,
		},
		theme: {
			type: String,
			default: "button", // text
		},
	},
	render(h) {
		const { current, omitPos, totalPage, theme } = this;
		const buttons = [];

		const createButton = (type, page) => {
			if (theme === "button")
				return simpleButton.call(this, h, type, page);
			return textButton.call(this, h, type, page);
		};

		if (current > 1) {
			buttons.push(createButton("FIRST", 1));
			buttons.push(createButton("PREV", current - 1));
		}
		if (current - omitPos > 1) {
			buttons.push(createButton("OMIT"));
		}
		for (let i = Math.max(current - omitPos, 1); i <= Math.min(current + omitPos, totalPage); i++) {
			if (i === current) {
				buttons.push(createButton("CURRENT", i));
			} else {
				buttons.push(createButton("JUMP", i));
			}
		}
		if (current + omitPos < totalPage) {
			buttons.push(createButton("OMIT"));
		}
		if (current < totalPage) {
			buttons.push(createButton("NEXT", current + 1));
			buttons.push(createButton("LAST", totalPage));
		}


		// <input class="jump" @keyup="jump"/>
		const jumpInput = h("input", {
			attrs: { "class": "jump" },
			on: { keyup: this.jump },
		});

		/*
		 * <div class="minor-text">
		 *     <span>共{{totalPage}}页，</span>
		 *     <label>跳至<input ...>页</label>
		 * </div>
		 */
		if (theme === "button") {
			const jump = h("div", { attrs: { "class": "minor-text" } }, [
				h("span", `共${totalPage}页，`),
				h("label", { attrs: { "class": "jump-label" } }, ["跳至", jumpInput, "页"]),
			]);
			const btnWrapper = h("div", { attrs: { "class": "buttons" } }, buttons);
			return h("div", { attrs: { "class": "button-pager" } }, [btnWrapper, jump]);
		}

		buttons.unshift(h("span", { staticClass: ".button-pager-total" }, "共" + totalPage + "页"));
		const btnWrapper = h("div", { staticClass: "buttons" }, buttons);
		return h("div", { attrs: { "class": "text-pager" } }, [btnWrapper]);
	},
	computed: {
		current() {
			return this.index + 1;
		},
		totalPage() {
			return Math.max(0, Math.floor((this.totalCount - 1) / this.pageSize) + 1);
		},
	},
	methods: {
		jump(event) {
			if (event.key === "Enter") {
				this.$emit("load-page", event.target.value - 1);
				event.target.value = "";
			}
		},
		showPage(index) {
			this.$emit("load-page", index - 1);
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImport";

.button-pager {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.button-pager-total {
	margin-right: 1rem;
}

.buttons button {
	margin: 0 .2rem;
}

.jump {
	font-size: .8em;
	width: 4em;
	margin: 0 .5em;
	text-align: center;
}

.omit {
	cursor: default;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	user-select: none;
}

button + .omit {
	vertical-align: middle;
	line-height: 34px;
	padding: 0 1rem;
	font-size: 1.5em;
}

.jump-label {
	display: inline-flex;
	align-items: center;
}

.active {
	padding: 0 .3rem;
	color: #00a1ff;
	font-weight: 600;
}

.text-link {
	padding: 0 .3rem;

	&:hover, &:focus {
		color: @color-second;
	}
}
</style>
