const utils = require("../utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./polyfill.config");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');


const webpackConfig = merge(baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true }),
	},
	devtool: (process.env.WEBPACK_MODE === "development" || config.build.productionSourceMap)
		? config.build.devtool : false,
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
			entry: utils.resolve('src/service-worker/index.ts'),
			includes: ["static/**/*"],
			excludes: ['**/.*', '**/*.map', "static/icons/*"]
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

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
