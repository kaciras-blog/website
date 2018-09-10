const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');


const webpackConfig = merge(baseWebpackConfig, {
	mode: "production",
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: utils.assetsPath('css/[name].[hash].css'),
			allChunks: true,
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions: {map: {inline: false}},
		}),
		new HtmlWebpackPlugin({
			filename: config.build.index,
			template: 'public/index.html',
			inject: true,
			chunksSortMode: 'dependency', // necessary to consistently work with multiple chunks via CommonsChunkPlugin
		}),

		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
	]
});

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
