const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.resolve = dir => path.join(__dirname, "..", dir);

exports.assetsPath = function (_path) {
	return path.posix.join("static", _path);
};

exports.cssLoaders = function (options) {
	const cssLoader = {
		loader: "css-loader",
		options: {
			sourceMap: options.cssSourceMap,
			modules: options.modules,
			localIdentName: options.mode === "production"
				? "[hash:base64:8]"
				: "[local]_[hash:base64:8]",
		},
	};

	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) {
		const loaders = [cssLoader];

		if (loader) {
			loaders.push({
				loader: loader + "-loader",
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.cssSourceMap,
				}),
			});
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return [MiniCssExtractPlugin.loader].concat(loaders);
		} else {
			return ["vue-style-loader"].concat(loaders);
		}
	}

	return {
		css: generateLoaders(),
		less: generateLoaders("less"),
	};
};

exports.styleLoaders = function (options) {
	const output = [];
	const loaders = exports.cssLoaders(options);

	// 再生成一个CSS Modules的加载器
	options.modules = true;
	const moduleLoaders = exports.cssLoaders(options);

	for (const extension in loaders) {
		output.push({
			test: new RegExp("\\." + extension + "$"),
			oneOf: [
				{
					resourceQuery: /module/,
					use: moduleLoaders[extension],
				},
				{
					use: loaders[extension],
				},
			],
		});
	}

	return output;
};
