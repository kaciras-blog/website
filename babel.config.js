module.exports = (api) => {
	api.cache(true);

	return {
		presets: [
			["@babel/preset-env", { corejs: 3, useBuiltIns: "usage" }],
		],
		plugins: [
			["@babel/plugin-transform-runtime", { regenerator: false }],
			["@babel/plugin-proposal-decorators", { legacy: true }],
		]
	};
};
