module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	rules: {
		"indent": ["error", "tab"],
		"comma-dangle": ["error", "always-multiline"],
		"semi": ["error", "always"],
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"no-unused-vars": "warn",
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
