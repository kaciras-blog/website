// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
const utils = require('./utils');
const path = require('path');

module.exports = {
	dev: {
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

		useEslint: true,
		// If true, eslint errors and warnings will also be shown in the error overlay
		// in the browser.
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
		// Set to `true` or `false` to always turn it on or off
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
