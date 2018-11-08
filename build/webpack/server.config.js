const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const baseConfig = require("./base.config");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const { styleLoaders, resolve } = require("../utils");
const config = require("../config");
const webpack = require("webpack");


module.exports = merge(baseConfig, {
	entry: resolve("/src/entry-server.js"),
	target: "node",
	devtool: "source-map",
	output: {
		filename: "server-bundle.js",
		libraryTarget: "commonjs2",
	},

	module: {
		rules: styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: false,
		}),
	},

	// 外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的 bundle 文件。
	externals: nodeExternals({
		whitelist: [/\.css$/, /\.less$/, /\.vue$/, /kx-ui/],
	}),


	plugins: [
		new webpack.DefinePlugin({
			"process.env.VUE_ENV": "'server'",
		}),

		// 这是将服务器的整个输出构建为单个 JSON 文件的插件。
		// 默认文件名为 `vue-ssr-server-bundle.json`
		new VueSSRServerPlugin(),
	],
});
