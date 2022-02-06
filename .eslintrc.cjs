module.exports = {
	root: true,
	extends: [
		"@kaciras/core",
		"@kaciras/typescript",
		"@kaciras/vue/typescript",
	],
	overrides: [
		{
			files: "**/tests/**/*.spec.ts",
			extends: ["@kaciras/jest"],
		},
		{
			files: "./*",
			env: { node: true },
		},
	],
};
