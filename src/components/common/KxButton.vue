<script>
import Vue from "vue";

export default {
	name: "KxButton",
	functional: true,
	props: {
		// 按钮的标签可以为任何HTML标签，比如可以把<a>作为按钮。
		tag: {
			type: String,
			default: "button",
		},
		// 设置此属性后将渲染为 router-link,其to属性等于此属性的值
		route: String,
	},
	render(h, ctx) {
		const { data, children } = ctx;
		const { staticClass, attrs } = data;

		const clazz = ["kx-btn"];
		if (staticClass) {
			clazz.push(staticClass);
		}
		if (attrs && attrs.class) {
			clazz.push(attrs.class);
			delete attrs.class;
		}
		data.staticClass = clazz.join(" ");

		// 上面设置样式，下面处理特殊标签
		let { tag, route } = ctx.props;
		if (route) {
			data.props = data.props || {};
			data.props.tag = tag;
			data.props.to = route;
			tag = Vue.component("router-link");
		}
		if (tag === "button") {
			data.attrs = attrs || {};
			data.attrs.type = "button";
		}
		return h(tag, data, children);
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport";

@color-button-primary: @color-primary; // 主要
@color-button-second: #f570c7; // 次要
@color-button-info: #25cb58; // 信息
@color-button-dangerous: #ef4c42; // 危险

// 条纹宽度
@stripeWidth: 32px;

// 园角按钮的圆角半径
@radius: .25rem;

.square {
	border-radius: 0 !important;
}

.kx-btn {
	display: inline-block;
	position: relative;
	vertical-align: top;

	// 内部布局
	padding: .5rem 1.2rem;
	font-size: 1rem;
	line-height: 1;
	text-align: center;
	white-space: nowrap;

	// 基本样式
	border: solid 1px #e0e0e0;
	background-color: transparent;
	border-radius: @radius;
	.click-item;

	// 默认的颜色变量
	.color-mixin(@color-button-primary);

	// 各种伪类下的样式
	transition: ease-in-out .15s;
	.focus-ripple-mixin;
	.psudo-style;

	// 混入主题颜色
	&.primary {
		.flat-style;
	}
	&.second {
		.color-mixin(@color-button-second);
		.flat-style;
	}
	&.info {
		.color-mixin(@color-button-info);
		.flat-style;
	}
	&.dangerous {
		.color-mixin(@color-button-dangerous);
		.flat-style;
	}

	// 镂空按钮样式
	&.outline {
		.outline-style;
	}

	// 禁用按钮样式，所有颜色按钮禁用样式都一样
	&:disabled, :disabled:hover {
		cursor: initial;
		pointer-events: none; // `<a>`禁用状态下也能点击

		&:not(.running) {
			color: dimgray;
			border-color: #d9dfdf;
			background-color: #d9dfdf;
		}
	}

	// 图标按钮样式
	&.icon {
		border: none;
		font-size: 1.3rem;
		padding: .3rem .8rem;
	}

	// 正在运行的按钮样式，因为需要长时间运行的任务并不一定是加载，所以没用.loading
	// noinspection CssOptimizeSimilarProperties
	&.running {
		&, &:hover {
			color: white;
			background-color: var(--background-active);
			border-color: var(--background-highlight);
			background-size: @stripeWidth @stripeWidth;
		}

		background-image: linear-gradient(-45deg,
		var(--background-highlight) 25%, transparent 25%,
		transparent 50%, var(--background-highlight) 50%,
		var(--background-highlight) 75%, transparent 75%);

		animation: barbershop linear .4s infinite;
	}
}

.psudo-style() {
	&:hover {
		color: white;
		background-color: var(--background);
		border-color: var(--background);
		text-decoration: none; // <a>作为按钮时需要
	}
	&:active {
		color: white;
		background-color: var(--background-active);
		border-color: var(--background-active);
	}
	&:focus {
		outline: 0;
	}
}

// 填充样式
.flat-style() {
	color: white;
	border-color: var(--background);
	background-color: var(--background);
	.psudo-style;
}

.outline-style() {
	background-color: transparent;
	color: var(--background);

	&:hover, &:active {
		color: white;
		background-color: var(--background);
	}
	.psudo-style;
}

// 配置各主题色，less还不支运算作为CSS变量值，需要先用变量定义
.color-mixin(@color) {
	@color-active: @color - #121212;
	@color-highlight: lighten(@color, 6%);
	--background: @color;
	--background-active: @color-active;
	--background-highlight: @color-highlight;
}

// 聚焦时发出波纹效果
.focus-ripple-mixin() {
	@media screen and (min-width: @length-screen-mobile) {
		&:focus::after {
			content: "";
			display: block;
			position: absolute;

			border-radius: 6px;
			.margin-abs(-2px);
			border: solid 4px var(--background);

			pointer-events: none;
			opacity: 0;
			animation: button-ripple .4s;
		}
	}
}

@keyframes button-ripple {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
		transform: scale(1.1, 1.2);
	}
}

// 国内理发店就是这个效果
@keyframes barbershop {
	from {
		background-position: 0;
	}
	to {
		background-position: -@stripeWidth;
	}
}
</style>
