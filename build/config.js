const utils = require('./utils');
const path = require('path');

module.exports = {
	dev: {
		// 一些特殊的文件系统，如网络文件需要使用poll方式监听更改
		poll: false,

		// Eslint 有IDE支持，就不再webpack里检查了
		useEslint: false,

		// If true, eslint errors and warnings will also be shown in the error overlay in the browser.
		showEslintErrorsInOverlay: false,

		devtool: 'cheap-module-eval-source-map',
		cssSourceMap: true
	},

	build: {
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		publicPath: "/",

		// Source Maps
		productionSourceMap: false,

		// https://webpack.js.org/configuration/devtool/#production
		devtool: '#source-map',

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		bundleAnalyzerReport: process.env.npm_config_report
	},

	vueLoader: {
		loaders: utils.cssLoaders({
			sourceMap: true,
			extract: true,
		}),
		transformToRequire: {
			video: ['src', 'poster'],
			source: 'src',
			img: 'src',
			image: 'xlink:href'
		},
		compilerOptions:{
			preserveWhitespace: false,
		},
		cssSourceMap: true,

		// If you have problems debugging vue-files in devtools, set this to false - it *may* help
		cacheBusting: true,
	}
};
