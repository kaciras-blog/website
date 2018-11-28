const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const baseWebpackConfig = require("./base.config");
const utils = require("../utils");


const setupBabel = (webpackConfig) => {
	webpackConfig.entry.unshift("@babel/polyfill");

	webpackConfig.module.rules.push({
		test: /\.jsx?$/,
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
		options: { cacheDirectory: true },
	});
};

module.exports = (options) => {
	const webpackConfig = merge(baseWebpackConfig(options), {
		entry: [utils.resolve("src/entry-client.js")],
		module: {
			rules: utils.styleLoaders({ sourceMap: options.cssSourceMap, extract: true }),
		},
		devtool: options.devtool,
		output: {
			filename: utils.assetsPath("js/[name].[hash].js"),
			chunkFilename: utils.assetsPath("js/[id].[hash].js"),
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						name: "vendors",
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						chunks: "all",
					},
					async: {
						name: "async",
						chunks: "async",
						minChunks: 3,
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
	});

	if (options.useBabel) {
		setupBabel(webpackConfig);
	}

	if (options.bundleAnalyzerReport) {
		const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
		webpackConfig.plugins.push(new BundleAnalyzerPlugin());
	}

	return webpackConfig;
};
