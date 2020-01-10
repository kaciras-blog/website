/**
 * 配置文件，包括构建配置和运行配置，该文件被 webserver 使用。
 * webserver 默认加载 index.js，通过启动参数 --profile=prod 可以让它改为加载本目录下的 prod.js
 */
const path = require("path");

/**
 * 全部的配置项，除了注释里有【可选】以外的均为必填项，有【环境】的项需要修改为自己的环境
 */
module.exports = {

	/** 构建输出的目录 */
	outputDir: path.resolve(__dirname, "../dist"),

	/** 静态资源目录，相对于outputDir */
	assetsDir: "static",

	webpack: {
		mode: "development",
		publicPath: "/",

		/** 是否使用多线程编译JS文件 */
		parallel: true,

		/** 是否启用 webpack-bundle-analyzer */
		bundleAnalyzerReport: false,

		/** 客户端构建的一些其他选项 */
		client: {
			useBabel: true,
			devtool: "cheap-module-eval-source-map",
			cssSourceMap: true,
		},

		/** 服务端构建的一些其他选项 */
		server: {
			devtool: "source-map",
			cssSourceMap: false,
		},

		/** 传递给 vue-loader 的选项，具体说明见Vue的官网 */
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
	},

	/** 开发服务器的配置项 */
	dev: {

		/**
		 * 热重载中间件的选择，如果为 false 则使用传统的 webpack-hot-middleware，
		 * true 或未指定则使用 webpack-hot-client。
		 */
		useHotClient: true,
	},

	/** 连接设置，可以配置接受HTTP和HTTPS连接 */
	server: {

		http: {
			// port: 80,

			/**
			 * 【可选】如果该项为true，则该端口将发送301重定向到HTTPS端口。
			 * 该选项也可以为整数，表示重定向目的地的端口号。
			 */
			redirect: true,
		},

		https: {
			// port: 443,
			certFile: "/etc/letsencrypt/live/www.example.com/cert.pem",
			keyFile: "/etc/letsencrypt/live/www.example.com/privkey.pem",
		},
	},

	blog: {

		/**
		 * 【环境】网页所在的域，该项用于CORS和防镜像检测。
		 * 【注意】CORS 包含端口，但目前不支持端口限制。
		 */
		host: "localhost",

		/** 【环境】上传的图片保存的位置 */
		imageRoot: "/var/blog/images",

		/** 【环境】内容服务器的内部访问 URL，用于服务端渲染和内部通信 */
		serverAddress: "https://localhost:12345",

		/**
		 * 【环境】【可选】内容服务器的证书，如果它启用了HTTPS的话可能需要添加额外的信任。
		 * 如果内容服务器没有使用HTTPS，或是从 serverAddress 访问的证书没问题则此项可以去掉。
		 * 把此项设置为 true 可以关闭 NodeJS 的 HTTP 证书检查。
		 */
		// serverCert: "/etc/letsencrypt/live/api.example.com/cert.pem",
	},

	/** 该对象由 process.env 传递到构建的脚本里 */
	envConfig: {

		/** 【环境】内容服务器的公网 URL，如果是对象则依据页面使用HTTP还是HTTPS选择 */
		contentServerUri: "https://api.example.com",
		// contentServerUri: {
		// 	http: "http://api.example.com:54321",
		// 	https: "https://api.example.com:12345",
		// },

		/** 【可选】Google Analytics 的ID，不填则不启用 Google Analytics */
		GOOGLE_ANALYTICS_ID: "UA-12345678-1",

		/** 【可选】本站使用 Sentry 来上报异常，填写该项后将启用 */
		SENTRY_DSN: "https://foobar@sentry.io/123456",
	},
};
