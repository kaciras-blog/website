const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.assetsPath = function (_path) {
	return path.posix.join('static', _path)
};

exports.cssLoaders = function (options) {
	options = options || {};

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: options.sourceMap
		}
	};

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions) {
		const loaders = [cssLoader];

		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			 return [MiniCssExtractPlugin.loader].concat(loaders)
		} else {
			return ['vue-style-loader'].concat(loaders)
		}
	}

	return {
		css: generateLoaders(),
		less: generateLoaders('less'),
	}
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	const output = [];
	const loaders = exports.cssLoaders(options);

	for (const extension in loaders) {
		const loader = loaders[extension];
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader,
		})
	}

	return output
};
