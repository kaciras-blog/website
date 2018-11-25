const baseWebpackConfig = require("./base.config");
const { resolve } = require("../utils");
const merge = require("webpack-merge");


// 复制一份避免污染全局，也可以直接合并两个配置
const configCopy = merge(baseWebpackConfig, {});

configCopy.entry = [
	"@babel/polyfill", // polyfill要放在项目入口之前
	resolve("src/entry-client.js"),
];

configCopy.module.rules.push({
	test: /\.js$/,
	loader: "babel-loader",
	include: [
		resolve("src"),
		resolve("test"),
		resolve("node_modules/webpack-hot-client/client"),
		resolve("node_modules/kx-ui/src"),
		resolve("node_modules/markdown-it-anchor"),
	],
	exclude: [
		resolve("src/service-worker"),
	],
	options: {
		cacheDirectory: true,
	}
});

module.exports = configCopy;
