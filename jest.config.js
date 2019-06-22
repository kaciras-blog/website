module.exports = {
	moduleFileExtensions: ["ts", "tsx", "js"],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	preset: "ts-jest",
	transform: {
		"^.+\\.jsx?$": "babel-jest",
		"^.+\\.tsx?$": "ts-jest",
	},
	testMatch: [
		"**/test/**/*.+(ts|tsx|js)"
	],
	transformIgnorePatterns:[
		"node_modules/(?!kx-ui/)" // kx-ui 没有构建，必须要编译
	],
};
