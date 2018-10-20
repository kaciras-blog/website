const utils = require("./utils");
const config = require("./config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.polyfill.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(baseWebpackConfig, {
	mode: "development",
	module: {
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
	},
	// cheap-module-eval-source-map is faster for development
	devtool: config.dev.devtool,

	// these devServer options should be customized in /config/config.js
	devServer: {
		clientLogLevel: "error",
		compress: false,
		publicPath: "/",
		index: "index.html",
		historyApiFallback: {
			rewrites: [{ from: /.*/, to: "/" }],
		},
		inline: true,
		hot: true,
		contentBase: false, // since we use CopyWebpackPlugin.
		host: "localhost",
		port: 8080,
		open: false,
		overlay: false,

		// 一些需要其它服务器处理的请求
		proxy: {
			"/image": {
				target: "https://localhost",
				secure: false, // 开发环境使用自签名证书
			},
		},
		watchOptions: {
			poll: config.dev.poll,
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "public/index.html",
			inject: true,
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
});
