const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const baseWebpackConfig = require("./base.config");
const utils = require("../utils");


const setupBabel = (webpackConfig, options) => {
	webpackConfig.entry.unshift("@babel/polyfill");

	const loaders = [{
		loader: "babel-loader",
		options: { cacheDirectory: true },
	}];

	if (options.parallel) {
		loaders.unshift({ loader: "thread-loader" });
	}

	webpackConfig.module.rules.push({
		test: /\.jsx?$/,
		use: loaders,
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
	});
};

module.exports = (options) => {
	Object.assign({}, options, options.client);

	const config = {
		entry: [utils.resolve("src/entry-client.js")],
		module: {
			rules: utils.styleLoaders({ ...options, extract: true }),
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
					from: utils.resolve("public"),
					to: ".",
					ignore: ["index.html"],
				}]
			),
			new ServiceWorkerWebpackPlugin({
				entry: utils.resolve("src/service-worker/index.ts"),
				includes: ["static/**/*"],
				excludes: ["**/.*", "**/*.map", "static/icons/*"],
			}),
			new MiniCssExtractPlugin({
				filename: utils.assetsPath("css/[name].[hash].css"),
				allChunks: true,
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: { map: { inline: false } },
			}),
			new webpack.HashedModuleIdsPlugin(),
			new VueSSRClientPlugin(),
		],
	};

	if (options.mode === "production") {
		config.output = {
			filename: utils.assetsPath("js/[name].[contenthash:8].js"),
			chunkFilename: utils.assetsPath("js/[name].[contenthash:8].js"),
		};
	}

	if (options.useBabel) {
		setupBabel(config);
	}

	if (options.bundleAnalyzerReport) {
		const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
		config.plugins.push(new BundleAnalyzerPlugin());
	}

	return merge(baseWebpackConfig(options), config);
};
