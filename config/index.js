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

	server: {

		/** 【可选】服务器端口，默认是80或443，取决于有没有启用HTTPS */
		// port: 80,

		/** 【环境】【可选】HTTPS的证书，如果没有此项则不启用HTTPS */
		// tls: {
		// 	certFile: "/etc/letsencrypt/live/www.example.com/cert.pem",
		// 	keyFile: "/etc/letsencrypt/live/www.example.com/privkey.pem",
		// },

		/**
		 * 【可选】如果启用了HTTPS，是否启动HTTP服务器将HTTP请求重定向到HTTPS。
		 * 该选项也可以为整数，指定HTTP服务器的端口。
		 */
		httpRedirect: true,
	},

	/** 开发服务器的配置项 */
	dev: {

		/** 是否使用 webpack-hot-client，如果为 false 则使用传统的 webpack-hot-middleware */
		useHotClient: false,
	},

	blog: {

		/** 【环境】前端服务器自带图片存储功能，上传的图片保存在该位置 */
		imageRoot: "/var/blog/images",

		/** 【环境】内容服务器的内部访问 URL，用于服务端渲染和内部通信 */
		serverAddress: "https://localhost:12345",

		/** 【环境】内容服务器是否启用了HTTPS */
		https: false,

		/**
		 * 【环境】【可选】内容服务器的证书，如果它启用了HTTPS的话可能需要添加额外的信任。
		 * 如果内容服务器没有使用HTTPS，或是从 serverAddress 访问的证书没问题则此项可以去掉。
		 * 把此项设置为 true 可以关闭 NodeJS 的 HTTP 证书检查。
		 */
		// serverCert: "/etc/letsencrypt/live/api.example.com/cert.pem",

		/** CORS 的配置，不解释了都看得懂，具体见 @koa/cors */
		cors: {
			origin: "https://localhost",
			maxAge: 864000,
			exposeHeaders: ["Location"],
			allowHeaders: ["X-CSRF-Token", "X-Requested-With", "Content-Type"],
			credentials: true,
		},
	},

	/** 该对象由 process.env.CONFIG 传递到构建的脚本里 */
	envConfig: {

		/** 【环境】内容服务器的公网 URL */
		contentServerUri: "https://api.example.com",

		/** 【可选】网站的前端地址，目前该项仅用于防镜像检测 */
		// webHost: "https://localhost",

		/** 【可选】Google Analytics 的ID，不填则不启用 Google Analytics */
		// googleAnalyticsId: "UA-12345678-1",

		/** 【可选】本站使用 Sentry 来上报异常，填写该项后将启用 */
		// sentryDSN: "https://foobar@sentry.io/123456",
	},
};
