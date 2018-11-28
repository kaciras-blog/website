const path = require("path");


module.exports = {
	mode: "development",
	outputPath: path.resolve(__dirname, "../dist"),
	publicPath: "/",
	useEslint: false,
	bundleAnalyzerReport: process.env.npm_config_report,

	client: {
		useBabel: true,
		parallel: false,
		devtool: "cheap-module-eval-source-map",
		cssSourceMap: true,
	},

	server: {
		devtool: "source-map", // 服务端没有eval模式
		cssSourceMap: false,
	},

	vueLoader: {
		transformAssetUrls: {
			video: ["src", "poster"],
			source: "src",
			img: "src",
			image: "xlink:href",
		},
		compilerOptions: {
			preserveWhitespace: false,
		},

		// If you have problems debugging vue-files in devtools, set this to false - it *may* help
		cacheBusting: true,
	},
};
