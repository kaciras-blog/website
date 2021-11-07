const jestConfig = require("./jest.config");

module.exports = {
	root: true,
	extends: [
		"@kaciras/core",
		"@kaciras/typescript",
		"@kaciras/vue/typescript",
	],
	overrides: [{
		files: jestConfig.testMatch,
		extends: ["@kaciras/jest"],
	}],
};
