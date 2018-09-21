<!--<template>-->
	<!--<div class="button-pager">-->
		<!--<div class="buttons">-->
			<!--<button class="outline"-->
					<!--v-if="current > 1"-->
					<!--@click="showPage(1)">首页-->
			<!--</button>-->

			<!--<button class="outline"-->
					<!--v-if="current > 1"-->
					<!--@click="showPage(current-1)">上一页-->
			<!--</button>-->

			<!--<span v-if="current - omitPos > 0" class="omit">...</span>-->

			<!--<template v-for="i in totalPage" v-if="i>current - omitPos && i < current + omitPos && i<= totalPage">-->
				<!--<button :key="i" v-if="i === current">{{i}}</button>-->
				<!--<button class="outline" :key="i" @click="showPage(i)" v-else>{{i}}</button>-->
			<!--</template>-->

			<!--<span v-if="current + omitPos <= totalPage" class="omit">...</span>-->

			<!--<button class="outline"-->
					<!--v-if="current < totalPage"-->
					<!--@click="showPage(current+1)">下一页-->
			<!--</button>-->

			<!--<button class="outline"-->
					<!--v-if="current < totalPage"-->
					<!--@click="showPage(totalPage)">尾页-->
			<!--</button>-->
		<!--</div>-->

		<!--<div class="minor-text">-->
			<!--<span>共{{totalPage}}页，</span>-->
			<!--<label>跳至<input class="jump" @keyup.13="jump">页</label>-->
		<!--</div>-->
	<!--</div>-->
<!--</template>-->

<script>
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
	},
	render(h) {
		const { current, omitPos, totalPage } = this;
		const buttons = [];

		const createButton = (page, content, current) => {
			if(content === "...") {
				return h("span", {attrs: { "class": "omit" }}, content);
			}
			return h("button", {
				attrs: { "class": current ? "" : "outline" },
				on: { click: () => this.showPage(page) },
			}, content);
		};

		if (current > 1) {
			buttons.push(createButton(1, "首页", false));
			buttons.push(createButton(current - 1, "上一页", false));
		}
		if (current - omitPos > 1) {
			buttons.push(createButton(0, "...", false));
		}
		for (let i = Math.max(current - omitPos, 1); i <= Math.min(current + omitPos, totalPage); i++) {
			if (i === current) {
				buttons.push(createButton(i, i, true));
			} else {
				buttons.push(createButton(i, i, false));
			}
		}
		if(current + omitPos < totalPage) {
			buttons.push(createButton(0, "...", false));
		}
		if (current < totalPage) {
			buttons.push(createButton(current + 1, "下一页", false));
			buttons.push(createButton(totalPage, "尾页", false));
		}

		const btnWrapper = h("div", { attrs: { "class": "buttons" }}, buttons);

		// <input class="jump" @keyup="jump"/>
		const jumpInput = h("input", {
			attrs:{ "class": "jump"},
			on: { keyup: this.jump },
		});

		/*
		 * <div class="minor-text">
		 *     <span>共{{totalPage}}页，</span>
		 *     <label>跳至<input ...>页</label>
		 * </div>
		 */
		const jump = h("div", {
			attrs: { "class": "minor-text" },
		}, [
			h("span", `共${totalPage}页，`),
			h("label", ["跳至", jumpInput, "页"]),
		]);

		return h("div", { attrs: { "class": "button-pager" } }, [btnWrapper, jump]);
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
			if(event.key === "Enter") {
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
.button-pager {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
	line-height: 34px;
	padding: 0 1rem;
	cursor: default;
	font-size: 1.5em;
	user-select: none;
}

label {
	display: inline-flex;
	align-items: center;
}
</style>
