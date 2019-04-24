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
		"indent": ["error", "tab", {
			SwitchCase: 1,
			FunctionDeclaration: { parameters: "off" }, // first 在 tab 缩进下有bug
			ignoreComments: true, // IDE 自动注释直接加在开头
		}],
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
