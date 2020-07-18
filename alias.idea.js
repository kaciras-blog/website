/**
 * 本文件对项目无任何作用，仅作为 WebStorm 识别别名用。
 * 进入 WebStorm preferences -> Language & Framework -> JavaScript -> Webpack，选择这个文件即可。
 */
const { join } = require("path");

function resolve(dir) {
	return join(__dirname, dir);
}

module.exports = {
	resolve: {
		alias: {
			'@': resolve('src'),
		},
	},
};
