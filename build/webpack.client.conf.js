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
				styles: {
					name: 'styles',
					test: /\.(css|less|vue)$/,
					chunks: 'all',
					enforce: true
				},
				async: {
					name: 'async',
					chunks: 'async',
					minChunks: 3
				},
			},
		},
		runtimeChunk: {
			name: "manifest",
		},
	},
	plugins: [
		// 在输出目录中生成 `vue-ssr-client-manifest.json`。
		new VueSSRClientPlugin()
	]
});
