const path = require('path');
const chalk = require('chalk');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const webpack = promisify(require('webpack'));
const config = require('../config');


async function build(mode) {
	let webpackConfig;

	if(mode === "-server") {
		webpackConfig = require('./webpack.server.conf')
	} else {
		webpackConfig = require('./webpack.client.conf');
		await rimraf(path.join(config.build.assetsRoot, "static"));
	}

	const stats = await webpack(webpackConfig);
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false, // Setting this to true will make TypeScript errors show up during build.
		chunks: false,
		chunkModules: false
	}) + '\n\n');

	if (stats.hasErrors()) {
		console.log(chalk.red('  Build failed with errors.\n'));
		process.exit(1)
	}
	console.log(chalk.cyan('Build complete.\n'));
}

build(process.argv[2]).catch(console.error);
