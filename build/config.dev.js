const path = require("path");


const webpack = {
	mode: "development",

	outputPath: path.resolve(__dirname, "../dist"),	// webpack的输出目录
	publicPath: "/",	// 公共资源的URL前缀，可以设为外部服务器等
	assetsDirectory: "static",	// 公共资源输出目录，是outputPath的子目录

	bundleAnalyzerReport: process.env.npm_config_report,

	client: {
		file: path.resolve(__dirname, "webpack/client.config"),
		useBabel: true,
		parallel: false, // 多线程编译JS文件
		devtool: "cheap-module-eval-source-map",
		cssSourceMap: true,
	},

	server: {
		file: path.resolve(__dirname, "webpack/server.config"),
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

const server = {
	port: 80,
	httpsPort: 443,
	tls: true,
	certificate: "D:/Coding/Utils/dev.pem",
	privatekey: "D:/Coding/Utils/dev.pvk",
	redirectHttp: true,
};

const dev = {
	useHotClient: false,
	slient: false,
};

const blog = {
	imageRoot: "G:/备份/blog.kaciras.net/image",
	apiServer: "https://localhost:2375",
	cors: {
		maxAge: 864000,
		exposeHeaders: ["Location"],
		allowHeaders: ["X-CSRF-Token", "X-Requested-With", "Content-Type"],
		credentials: true,
	},
	cacheMaxAge: 12 * 30 * 86400 * 1000,
};

module.exports = { webpack, server, dev, blog };
