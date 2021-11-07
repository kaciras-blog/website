module.exports = {
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	preset: "ts-jest",
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testMatch: [
		"**/tests/**/*.spec.+(ts|js|tsx|jsx)",
		"**/tests/**/test-*.+(ts|js|tsx|jsx)",
	],
	transformIgnorePatterns: [
		"node_modules/(?!@kaciras-blog/uikit/)", // @kaciras-blog/uikit 没有构建，必须要编译
	],
};
