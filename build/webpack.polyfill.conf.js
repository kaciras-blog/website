const baseWebpackConfig = require("./webpack.base.conf");
const { resolve } = require("./utils");


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
		resolve("node_modules/webpack-dev-server/client"),
		resolve("node_modules/markdown-it-anchor"),
	],
});

module.exports = baseWebpackConfig;
