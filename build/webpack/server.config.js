const webpack = require("webpack");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const baseConfig = require("./base.config");
const { styleLoaders, resolve } = require("../utils");


module.exports = (options) => {
	Object.assign({}, options, options.server);

	return merge(baseConfig(options), {
		entry: resolve("/src/entry-server.js"),
		target: "node",
		devtool: "source-map", // SourceMap 也会打包进bundle里
		output: {
			filename: "server-bundle.js",
			libraryTarget: "commonjs2",
		},

		module: {
			rules: styleLoaders({ ...options, extract: false }),
		},

		// 外置化应用程序依赖模块，可以使服务器构建速度更快，并生成较小的 bundle 文件。
		externals: nodeExternals({
			whitelist: [/\.css$/, /\?vue&type=style/, /\.less$/, /\.vue$/, /kx-ui/],
		}),

		plugins: [
			new webpack.DefinePlugin({ "process.env.VUE_ENV": "'server'" }),

			// 这是将服务器的整个输出单个 JSON 文件的插件，默认文件名`vue-ssr-server-bundle.json`
			new VueSSRServerPlugin(),
		],
	});
};
