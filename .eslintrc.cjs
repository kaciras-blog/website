module.exports = {
	root: true,
	extends: [
		"@kaciras/core",
		"@kaciras/typescript",
		"@kaciras/vue/typescript",
	],
	overrides: [{
		files: "./*",
		env: { node: true },
	}],
};
