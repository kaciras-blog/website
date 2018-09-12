const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.conf');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const utils = require('./utils');
const config = require('../config');


module.exports = merge(baseConfig, {
	mode: "development",
	entry: "./src/entry-server.js",
	target: 'node',
	devtool: 'source-map',
	output: {
		filename: "server-bundle.js",
		libraryTarget: 'commonjs2',
	},

	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: false,
		}),
	},
	// https://webpack.js.org/configuration/externals/#function
	// https://github.com/liady/webpack-node-externals
	// 外置化应用程序依赖模块。可以使服务器构建速度更快，
	// 并生成较小的 bundle 文件。
	externals: nodeExternals({
		whitelist: [/\.css$/, /\.less$/, /\.vue$/, /kxdialog/],
	}),

	// 这是将服务器的整个输出
	// 构建为单个 JSON 文件的插件。
	// 默认文件名为 `vue-ssr-server-bundle.json`
	plugins: [
		new VueSSRServerPlugin(),
	],
});
