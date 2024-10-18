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

		chunkPriority: [
			[/Console\.vue$/, "Console"],
			[/Edit\w+Page\.vue$/, "EditorPage"],
			[/markdown-vue\/lib\/MarkdownView\.js$/, "MarkdownView"],
			[/index\.html$/, "index"],
		],

		/**
		 * 额外的 ServiceWorker 构建选项，没有则不构建 SW 入口。
		 *
		 * 【使用注意】
		 * 构建完了还需要设置 `app.serviceWorker` 来启用。
		 */
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

					IconParagraph: ["src"],
					IconSectionHeader: ["icon"],
					SocialLink: ["icon"],
					OauthIcon: ["icon"],
					ErrorContent: ["image"],
				},
			},
		},
	},

	sentry: {
		/**
		 * 【可选】填写后将启用 Sentry 上报异常，前端由 SENTRY_DSN 环境变量访问。
		 */
		// dsn: "https://foobar@sentry.io/123456",

		/**
		 * 是否代理 Sentry 请求以防止 ADBlock 拦截，前端由 SENTRY_TUNNEL 环境变量访问。
		 */
		tunnel: false,

		/**
		 * 上传 SourceMap 需要的一些信息，不上传则不需要写。
		 */
		// org: "org or account name",
		// project: "project",
		// authToken: "see https://sentry.io/settings/account/api/auth-tokens/",
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
		dataDir: "/var/opt/blog",

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
		 * 【环境】内容服务器的公网 URL，如果是对象则依据页面使用 HTTP 还是 HTTPS 选择
		 * 在客户端构建时用 import.meta.env.INTERNAL_ORIGIN 访问
		 */
		public: "https://api.example.com",
		// publicOrigin: {
		// 	http: "http://api.example.com:54321",
		// 	https: "https://api.example.com:12345",
		// },
	},

	/**
	 * 一些可选的功能，所有项在构建时均可由 import.meta.env.* 访问。
	 * 服务端也可以使用，但它们并不修改运行时的环境变量。
	 */
	env: {},
};
