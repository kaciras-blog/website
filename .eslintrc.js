module.exports = {
	root: true,
	env: {
		node: true
	},
	"extends": [
		"plugin:vue/essential",
		"plugin:jest/recommended",
		"eslint:recommended"
	],
	rules: {
		"indent": ["error", "tab", { SwitchCase: 1 }],
		"comma-dangle": ["error", "always-multiline"],
		"space-before-function-paren": "off",
		"semi": ["error", "always"],
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"no-unused-vars": "warn",
		"quotes": ["error", "double"],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
