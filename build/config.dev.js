const path = require("path");


module.exports = {
	mode: "development",

	outputPath: path.resolve(__dirname, "../dist"),	// webpack的输出目录
	publicPath: "/",	// 公共资源的URL前缀，可以设为外部服务器等
	assetsDirectory: "static",	// 公共资源输出目录，是outputPath的子目录

	useEslint: false, // 在构建时用EsLint检查
	bundleAnalyzerReport: process.env.npm_config_report,

	client: {
		useBabel: true,
		parallel: false, // 多线程编译JS文件
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
