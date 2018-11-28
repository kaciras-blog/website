const path = require("path");
const utils = require("./utils");


module.exports = {
	mode: "development",
	outputPath: path.resolve(__dirname, "../dist"),
	publicPath: "/",
	useEslint: false,
	bundleAnalyzerReport: process.env.npm_config_report,

	client: {
		useBabel: true,
		devtool: "#source-map",
		cssSourceMap: true,
	},

	server: {
		devtool: "cheap-module-eval-source-map",
		cssSourceMap: false,
	},

	vueLoader: {
		loaders: utils.cssLoaders({
			sourceMap: true,
			extract: true,
		}),
		transformToRequire: {
			video: ["src", "poster"],
			source: "src",
			img: "src",
			image: "xlink:href",
		},
		compilerOptions: {
			preserveWhitespace: false,
		},
		cssSourceMap: true,

		// If you have problems debugging vue-files in devtools, set this to false - it *may* help
		cacheBusting: true,
	},
};
