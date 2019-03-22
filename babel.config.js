module.exports = function (api) {
	api.cache(true);

	const presets = [
		[
			"@babel/preset-env",
			{ useBuiltIns: "usage", corejs: 3 },
		],
	];

	const plugins = [
		[
			"@babel/plugin-transform-runtime",
			{ regenerator: false },
		],
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-syntax-import-meta",
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-json-strings",
		[
			"@babel/plugin-proposal-decorators",
			{ legacy: true }
		],
		"@babel/plugin-proposal-function-sent",
		"@babel/plugin-proposal-numeric-separator",
		"@babel/plugin-proposal-throw-expressions",
	];

	return { presets, plugins };
};
