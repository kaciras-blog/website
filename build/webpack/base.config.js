/*
 * Vue 2.0 的模板，来自 https://github.com/vuejs-templates/webpack
 *
 * Vue-Cli 3.0 之后内置webpack的配置，Github上的项目也停止更新了。
 * 本项目预计在 Vue 3.0 正式发布之后也转为基于cli的构建配置。
 */
const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { assetsPath, resolve } = require("../utils");
const config = require("../config");
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');


const createLintingRule = () => ({
	test: /\.(js|vue)$/,
	loader: "eslint-loader",
	enforce: "pre",
	include: [resolve("src"), resolve("test")],
	options: {
		formatter: require("eslint-friendly-formatter"),
		emitWarning: !config.dev.showEslintErrorsInOverlay,
	},
});

module.exports = {
	context: path.resolve(__dirname, "../"),
	output: {
		path: config.build.assetsRoot,
		filename: "static/js/[name].js",
		publicPath: config.build.publicPath,
	},
	resolve: {
		extensions: [".js", ".jsx", ".vue", ".json"],
		alias: {
			"vue$": "vue/dist/vue.runtime.esm.js",
			// "jquery": "jquery/dist/jquery.slim.js",
			"@": resolve("src"),
		},
		symlinks: false,
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: resolve("public"),
				to: ".",
				ignore: ["index.html"],
			}]
		),
		new ServiceWorkerWebpackPlugin({
			entry: resolve('src/service-worker/index.js'),
			filename: "service-worker.js"
		}),
		new VueLoaderPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],
	module: {
		rules: [
			...(config.dev.useEslint ? [createLintingRule()] : []),
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: config.vueLoader,
			},
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: assetsPath("img/[name].[hash:8].[ext]"),
				},
			},
			{
				test: /\.(svg)(\?.*)?$/,
				loader: 'file-loader',
				options: {
					name: assetsPath('img/[name].[hash:8].[ext]'),
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: assetsPath("media/[name].[hash:8].[ext]"),
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: assetsPath("fonts/[name].[hash:8].[ext]"),
				},
			},
		],
	},
	node: {
		setImmediate: false,
		dgram: "empty",
		fs: "empty",
		net: "empty",
		tls: "empty",
		child_process: "empty",
	},
};
