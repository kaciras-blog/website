/**
 * 全部的配置项都在这里，该文件被 webserver 使用。
 * 默认加载 index.js，通过启动参数 --profile=prod 可以让它改为加载本目录下的 prod.js
 */
export default {

	/** 构建输出的目录，该目录中还会有 client 和 server 两个下级目录。 */
	outputDir: "dist",

	/** 静态资源目录，相对于outputDir */
	assetsDir: "static",

	/**
	 * 服务端渲染的入口，如果没有则不启用 SSR。
	 */
	ssr: "src/entry-server.ts",

	build: {
		/**
		 * 生成代码的模式，如果不存在则使用 Vite 默认值。
		 */
		// mode: "development",

		/**
		 * 代码图生成选项，默认不生成，详情见 Vite 的文档：
		 * https://vitejs.dev/config/#build-sourcemap
		 */
		// sourcemap: true,

		/**
		 * 生成代码的兼容性，根据 Vite 文档只要支持 import() 的就性，但其源码中却比这高。
		 * 此处设为与本项目设计时的兼容性一致。
		 * https://github.com/vitejs/vite/blob/526b5ce96a0a9028a60f810e6d58db34579191c1/packages/vite/src/node/build.ts#L276
		 */
		target: [
			"firefox74",
			"edge80",
			"chrome80",
			"safari13.1",
		],

		/** 是否启用 webpack-bundle-analyzer */
		bundleAnalyzer: false,

		/** 是否启用 vite-plugin-inspect */
		debug: false,

		serviceWorker: {
			src: "src/service-worker/server/index.ts",
			// dist: "sw.js",
			// includes: new RegExp("^/static/");
		},

		/** 传递给 vue-loader 的选项，具体说明见Vue的官网 */
		vueOptions: {
			template: {
				transformAssetUrls: {
					source: ["src"],
					img: ["src"],
					video: ["src", "poster"],

					"icon-paragraph": ["src"],
					"icon-section-header": ["icon"],
					"social-link": ["icon"],
					"oauth-icon": ["icon"],
					"error-content": ["image"],
				},
			},
		},

		/** 一些第三方服务，所有项均可由 import.meta.env.* 访问 */
		env: {

			/** 【可选】Google Analytics 的ID，填写后将启用 */
			// GOOGLE_ANALYTICS_ID: "UA-12345678-1",

			/** 【可选】本站使用 Sentry 来上报异常，填写后将启用 */
			// SENTRY_DSN: "https://foobar@sentry.io/123456",
		},
	},

	/** 连接设置，可以配置接受 HTTP 和 HTTPS 连接 */
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
		title: "Kaciras 的博客",
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
		 * 【可选】是否启用 ServiceWorker，默认不启用。
		 */
		// serviceWorker: true,

		/** 日志等级和文件 */
		logging: {

			level: "info",

			// file: "website.log",
		},
	},

	backend: {

		/**
		 * 【环境】内容服务器的内部访问 URL，用于服务端渲染和内部通信
		 * 在服务端构建时用 import.meta.env.PUBLIC_ORIGIN 访问
		 */
		internal: "http://localhost:12345",

		/**
		 * 请求超时（毫秒），0 表示永不超时。
		 */
		timeout: 10000,

		/**
		 * 【环境】【可选】内容服务器的证书，如果它启用了HTTPS的话可能需要添加额外的信任。
		 * 如果内容服务器没有使用HTTPS，或是从 serverAddress 访问的证书没问题则此项可以去掉。
		 * 把此项设置为 true 可以关闭 NodeJS 的 HTTP 证书检查。
		 */
		// cert: "/etc/letsencrypt/live/api.example.com/cert.pem",

		/**
		 * 【环境】内容服务器的公网 URL，如果是对象则依据页面使用HTTP还是HTTPS选择
		 * 在客户端构建时用 import.meta.env.INTERNAL_ORIGIN 访问
		 */
		public: "https://api.example.com",
		// publicOrigin: {
		// 	http: "http://api.example.com:54321",
		// 	https: "https://api.example.com:12345",
		// },
	},
};
