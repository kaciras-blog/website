const baseWebpackConfig = require("./base.config");
const { resolve } = require("../utils");


// polyfill要放在项目入口之前
baseWebpackConfig.entry = [
	"@babel/polyfill",
	resolve("src/entry-client.js"),
];

baseWebpackConfig.module.rules.push({
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

module.exports = baseWebpackConfig;
