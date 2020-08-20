/**
 * 配置文件，包括构建配置和运行配置，该文件被 webserver 使用。
 * webserver 默认加载 index.js，通过启动参数 --profile=prod 可以让它改为加载本目录下的 prod.js
 */
const path = require("path");

/**
 * 全部的配置项，注释里有【环境】的项需要修改为自己的环境
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

		/** 是否启用 speed-measure-webpack-plugin */
		speedMeasure: false,

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

				"icon-paragraph": "src",
				"icon-section-header": "icon",
				"social-link": "icon",
				"error-content": "image",
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

		/** 服务器绑定的地址，即 net.server.listen 的 hostname 参数 */
		// hostname: "::",

		connectors: [
			{
				/**
				 * HTTP的版本，1 = HTTP1.1，2 = HTTP2。
				 * HTTP2 也同时支持 HTTP1.1 连接。
				 */
				version: 1,

				/** 监听的端口 */
				port: 80,

				/**
				 * 【可选】该端口将发送301重定向到指定origin。
				 */
				// redirect: "https://localhost",
			},
			{
				version: 2,
				port: 443,

				/** HTTPS 的证书和私钥，如果存在这两项则启用TLS */
				certFile: "/etc/letsencrypt/live/www.example.com/cert.pem",
				keyFile: "/etc/letsencrypt/live/www.example.com/privkey.pem",
			},
		],

		/** 【可选】该项设为true表示使用 X-Forwarded-* 头，在有反向代理时使用 */
		// useForwardedHeaders: true,
	},

	app: {

		/** 网站标题和站长名字 */
		title: "Kaciras的博客",
		author: "Kaciras",

		/**
		 * 【环境】保存应用数据的目录，数据包括：
		 * image/ 上传的图片
		 * cache/ 优化后的图片
		 * video/ 上传的视频
		 * audio/ 上传的音频
		 */
		dataDir: "/var/lib/blog",

		/**
		 * 【可选】是否启用ServiceWorker，true 表示启用，默认不启用。
		 */
		// serviceWorker: true,

		/**
		 * AJAX请求超时（毫秒），0表示无超时，不影响非AJAX请求。
		 *
		 * 【环境变量】
		 * 该选项在构建时可由 process.env.TIMEOUT 访问
		 */
		requestTimeout: 10000,

		/** 日志等级和文件 */
		logging: {

			level: "info",

			// file: "website.log",
		},
	},

	contentServer: {

		/**
		 * 【环境】内容服务器的内部访问 URL，用于服务端渲染和内部通信
		 * 在服务端构建时用 process.env.API_ORIGIN 访问
		 */
		internalOrigin: "http://localhost:12345",

		/**
		 * 【环境】【可选】内容服务器的证书，如果它启用了HTTPS的话可能需要添加额外的信任。
		 * 如果内容服务器没有使用HTTPS，或是从 serverAddress 访问的证书没问题则此项可以去掉。
		 * 把此项设置为 true 可以关闭 NodeJS 的 HTTP 证书检查。
		 */
		// cert: "/etc/letsencrypt/live/api.example.com/cert.pem",

		/**
		 * 【环境】内容服务器的公网 URL，如果是对象则依据页面使用HTTP还是HTTPS选择
		 * 在客户端构建时用 process.env.API_ORIGIN 访问
		 */
		publicOrigin: "https://api.example.com",
		// publicOrigin: {
		// 	http: "http://api.example.com:54321",
		// 	https: "https://api.example.com:12345",
		// },
	},

	/** 一些第三方服务，所有项均可由 process.env 访问 */
	thirdParty: {

		/** 【可选】Google Analytics 的ID，不填则不启用 Google Analytics */
		// GOOGLE_ANALYTICS_ID: "UA-12345678-1",

		/** 【可选】本站使用 Sentry 来上报异常，填写该项后将启用 */
		// SENTRY_DSN: "https://foobar@sentry.io/123456",
	},
};
