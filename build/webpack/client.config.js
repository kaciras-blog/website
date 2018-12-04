const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const baseWebpackConfig = require("./base.config");
const { resolve, styleLoaders } = require("../utils");


const setupBabel = (webpackConfig, options) => {
	webpackConfig.entry.unshift("@babel/polyfill");

	const loaders = [{
		loader: "babel-loader",
		options: {
			cacheDirectory: true,
			cacheCompression: false,
		},
	}];

	if (options.parallel) {
		loaders.unshift({ loader: "thread-loader" });
	}

	webpackConfig.module.rules.push({
		test: /\.(mjs|jsx?)$/,
		use: loaders,
		include: [
			resolve("node_modules/kx-ui/src"),
			resolve("node_modules/markdown-it-anchor"),
			resolve("src"),
			resolve("test"),

			resolve("node_modules/webpack-hot-middleware/client"),
			resolve("node_modules/webpack-hot-client/client"),
		],
		exclude: [
			resolve("src/service-worker"),
		],
	});
};

module.exports = (options) => {
	options = Object.assign({}, options, options.client);
	const assetsPath = (path_) => path.posix.join(options.assetsDirectory, path_);

	const config = {
		entry: ["./src/entry-client.js"],
		module: {
			rules: styleLoaders({ ...options, extract: true }),
		},
		devtool: options.devtool,
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						name: "vendors",
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						chunks: "initial",
					},
					async: {
						name: "async",
						chunks: "async",
						priority: -20,
						minChunks: 2,
						reuseExistingChunk: true, // ?
					},
				},
			},
			runtimeChunk: {
				name: "manifest",
			},
		},
		plugins: [
			new CopyWebpackPlugin([
				{
					from: "./public",
					to: ".",
					ignore: ["index.html"],
				}]
			),
			new ServiceWorkerWebpackPlugin({
				entry: "./src/service-worker/index.ts",
				includes: ["static/**/*"],
				excludes: ["**/.*", "**/*.map", "static/icons/*"],
			}),
			new MiniCssExtractPlugin({
				filename: assetsPath("css/[name].[hash].css"),
				allChunks: true,
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: { map: { inline: false } },
			}),
			new webpack.HashedModuleIdsPlugin(),
			new VueSSRClientPlugin(),
		],
	};

	/** 默认文件名不带hash，生产模式带上以便区分不同版本的文件 */
	if (options.mode === "production") {
		config.output = {
			filename: assetsPath("js/[name].[contenthash:8].js"),
			chunkFilename: assetsPath("js/[name].[contenthash:8].js"),
		};
	}

	if (options.useBabel) {
		setupBabel(config, options);
	}

	if (options.bundleAnalyzerReport) {
		const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
		config.plugins.push(new BundleAnalyzerPlugin());
	}

	return merge(baseWebpackConfig(options, "client"), config);
};
