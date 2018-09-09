const merge = require('webpack-merge');
const baseConfig = require('./webpack.prod.conf');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseConfig, {
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: "vendors",
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					chunks: 'all',
				},
				async: {
					name: 'async',
					chunks: 'async',
					minChunks: 3
				},
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true
				}
			},
		},
		runtimeChunk: {
			name: "manifest",
		},
	},
	plugins: [
		// 此插件在输出目录中
		// 生成 `vue-ssr-client-manifest.json`。
		new VueSSRClientPlugin()
	]
});
