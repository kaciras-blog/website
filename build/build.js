const path = require('path');
const chalk = require('chalk');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const webpack = promisify(require('webpack'));
const config = require('../config');

/**
 * 因为要构建客户端和预渲染两种环境下的输出，所以写了这个文件来统一构建。
 *
 * @param mode 构建目标参数
 * @return {Promise<void>} 指示构建状态
 */
async function build(mode) {
	let webpackConfig;

	if(mode === "-server") {
		webpackConfig = require('./webpack.server.conf')
	} else {
		webpackConfig = require('./webpack.client.conf');
		await rimraf(path.join(config.build.assetsRoot, "static"));
	}

	webpackConfig.mode = "development";
	const stats = await webpack(webpackConfig);
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false, // Setting this to true will make TypeScript errors show up during build.
		chunks: false,
		chunkModules: false
	}) + '\n\n');

	if (stats.hasErrors()) {
		console.log(chalk.red('Build failed with errors.\n'));
		process.exit(1)
	}
	console.log(chalk.cyan('Build complete.\n'));
}

build(process.argv[2]).catch(console.error);
