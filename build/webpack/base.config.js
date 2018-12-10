/*
 * Vue 2.0 的模板，来自 https://github.com/vuejs-templates/webpack
 *
 * Vue-Cli 3.0 之后内置webpack的配置，Github上的项目也停止更新了。
 * 本项目预计在 Vue 3.0 正式发布之后也转为基于cli的构建配置。
 */
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const hash = require("hash-sum");
const { resolve } = require("../utils");


/**
 * 生成一个标识字符串，当 cache-loader 使用默认的读写选项时，这个字符串将
 * 参与缓存 hash 值的计算，以便在源码没变而构建配置变了后更新缓存。
 *
 * @param options 选项
 */
const vueCacheIdenifier = (options) => {
	const varibles = {
		"cache-loader": require("cache-loader/package.json").version,
		"vue-loader": require("vue-loader/package.json").version,
		"vue-template-compiler": require("vue-template-compiler/package.json").version,
		"mode": options.mode,
	};
	return hash(varibles);
};

// side: "client" or "server"
module.exports = (options, side) => {

	// 这里的 path 一定要用 posix 的斜杠，与URL中的斜杠一致
	const assetsPath = (path_) => path.posix.join(options.assetsDirectory, path_);

	return {
		mode: options.mode,
		context: path.resolve(__dirname, "../.."),
		output: {
			filename: "static/js/[name].js",
			path: options.outputPath,
			publicPath: options.publicPath,
		},
		resolve: {
			extensions: [
				".js", ".jsx",	// JavaScript
				".wasm",		// WebAssenbly
				".mjs",			// ES Module JavaScript
				".ts", ".tsx",	// TypeScript
				".vue", ".json",// Others
			],
			alias: {
				vue$: "vue/dist/vue.runtime.esm.js",
				"@": resolve("src"),
			},
			symlinks: false,
		},
		plugins: [
			new VueLoaderPlugin(),
			new CaseSensitivePathsPlugin(),
		],
		optimization: {
			noEmitOnErrors: true,
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
				{
					test: /\.vue$/,
					loader: "vue-loader",
					options: {
						...options.vueLoader,
						cacheDirectory: resolve("node_modules/.cache/vue-loader-" + side),
						cacheIdentifier: vueCacheIdenifier(options),
					},
				},
				{
					test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 8192,
						name: assetsPath("img/[name].[hash:8].[ext]"),
					},
				},
				{
					test: /\.(svg)(\?.*)?$/,
					loader: "file-loader",
					options: {
						name: assetsPath("img/[name].[hash:8].[ext]"),
					},
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

			// [Vue-Cli] process is injected via DefinePlugin, although some
			// 3rd party libraries may require a mock to work properly (#934)
			process: "mock",

			dgram: "empty",
			fs: "empty",
			net: "empty",
			tls: "empty",
			child_process: "empty",
		},
		performance: false, // 不提示资源过大等没啥用的信息
	};
};
