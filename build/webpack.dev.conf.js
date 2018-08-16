const utils = require('./utils');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");

const devWebpackConfig = merge(baseWebpackConfig, {
	mode: "development",
	module: {
		rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
	},
	// cheap-module-eval-source-map is faster for development
	devtool: config.dev.devtool,

	// these devServer options should be customized in /config/index.js
	devServer: {
		clientLogLevel: 'warning',
		compress: false,
		publicPath: "/",
		index: "index.html",
		historyApiFallback: {
			rewrites: [{from: /.*/, to: 'index.html'}],
		},
		inline: true,
		hot: true,
		contentBase: false, // since we use CopyWebpackPlugin.
		host: 'localhost',
		port: 8080,
		open: false,
		overlay: false,

		proxy: {}, //如果请求需要其他的服务器处理，比如API服务器
		watchOptions: {
			poll: config.dev.poll,
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'public/index.html',
			inject: true
		}),
		new webpack.HotModuleReplacementPlugin(),
	]
});

module.exports = devWebpackConfig;
