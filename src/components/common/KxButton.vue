<script>
export default {
	name: "KxButton",
	functional: true,
	props: {
		// 按钮的标签，比如可以把<a>作为按钮
		tag: {
			type: String,
			default: "button",
		},
	},
	render(h, ctx) {
		const { props, data, children } = ctx;
		const clazz = ["kx-btn"];

		if (data.staticClass) {
			clazz.push(data.staticClass);
		}
		data.staticClass = clazz.join(" ");

		if (!data.attrs) {
			data.attrs = {};
		}
		data.attrs.type = "button";
		return h(props.tag, data, children);
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImpoert";

// 主要按钮颜色
@color-button-primary: @color-primary;
@color-button-primary-text: white;

// 次要按钮颜色
@color-button-second: #f884c5;
@color-button-second-text: #ffffff;

//危险按钮颜色
@color-button-dangerous: #ef4c42;
@color-button-dangerous-text: white;

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

	// 默认的颜色变量，less还不支运算作为CSS变量值，需要先用变量定义
	--background: @color-button-primary;
	--text-color: @color-button-primary-text;

	@color-active: @color-button-primary - #121212;
	--background-active: @color-active;

	@color-highlight: @color-button-primary - #121212;
	--background-highlight: fade(@color-button-primary);


	// 各种伪类下的样式
	transition: ease-in-out .15s;
	.focus-ripple-mixin;

	&:hover {
		color: white;
		background-color: @color-button-primary;
		border-color: @color-button-primary;
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

	// 混入各种主题颜色
	&.primary {.button-color("primary");}
	&.second {.button-color("second");}
//	&.info {
//		.button-color("info");
//	}

	// 镂空按钮样式
	&.outline {
		background-color: transparent;
		color: var(--background);

		&:hover {
			color: var(--text-color);
			background-color: var(--background);
		}
		&:active {
			color: var(--text-color);
		}
	}

	// 禁用按钮样式，所有颜色按钮禁用样式都一样
	&:disabled, :disabled:hover {
		cursor: initial;
		pointer-events: none; // `<a>`禁用状态下也能点击

		&:not(.running) {
			color: dimgray;
			border-color: #d1d7d7;
			background-color: #d1d7d7;
		}
	}

	// 正在运行的按钮样式，因为需要长时间运行的任务并不一定是加载，所以没用.loading
	// noinspection CssOptimizeSimilarProperties
	&.running {
		color: var(--text-color);
		background-color: var(--background);
		border-color: var(--background);
		background-size: @stripeWidth @stripeWidth;

		background-image: linear-gradient(-45deg,
			var(--background-active) 25%, transparent 25%,
			transparent 50%, var(--background-active) 50%,
			var(--background-active) 75%, transparent 75%);

		animation: barbershop linear .4s infinite;
	}
}

.button-color(@name) {
	// 先从变量名获取到相应的变量（背景色，文字色）
	@bkg-color-var: "color-button-@{name}";
	@text-color-var: "color-button-@{name}-text";

	// 配置各主题色
	@color-active: @@bkg-color-var - #121212;
	--background: @@bkg-color-var;
	--text-color: @@text-color-var;
	--background-active: @color-active;

	border-color: var(--background);
	background-color: var(--background);
	color: var(--text-color);

	// 图标按钮样式
	&.icon {
		border: none;
		font-size: 1.3rem;
		padding: .3rem .8rem;
	}
}


// 聚焦时发出波纹效果
.focus-ripple-mixin() {
	&:focus::after {
		content: "";
		pointer-events: none;
		opacity: 0;
		display: block;
		position: absolute;
		animation: button-ripple .4s;
		.margin-abs(-2px);

		border-radius: 6px;
		border: solid 4px var(--background);
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
