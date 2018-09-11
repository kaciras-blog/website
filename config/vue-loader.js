const utils = require('../build/utils');
const config = require('./index');

module.exports = {
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
	cacheBusting: config.dev.cacheBusting,
};
