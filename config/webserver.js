const path = require("path");

const webpack = {
	mode: "development",
	publicPath: "/",	// 公共资源的URL前缀，可以设为外部服务器等
	parallel: true, // 多线程编译JS文件
	bundleAnalyzerReport: false, // 显示模块大小图

	client: {
		useBabel: true,
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
			whitespace: "condense",
		},
	},
};

// TODO: 端口的配置没有同步到api中
const server = {
	tls: {
		certFile:"D:/Coding/Utils/dev.pem",
		keyFile: "D:/Coding/Utils/dev.pvk",
	},
	httpRedirect: true,
};

const dev = {
	useHotClient: false,
	silent: false,
};

const blog = {
	imageRoot: "G:/备份/blog.kaciras.net/image",
	serverCert: "D:/Coding/Utils/dev.pem",
	serverAddress: "https://localhost:2375",
	cors: {
		maxAge: 864000,
		exposeHeaders: ["Location"],
		allowHeaders: ["X-CSRF-Token", "X-Requested-With", "Content-Type"],
		credentials: true,
	},
};

module.exports = {
	outputDir: path.resolve(__dirname, "../dist"), // 构建输出的目录
	assetsDir: "static", // 静态资源目录，相对于outputDir

	webpack, server, dev, blog ,
};
