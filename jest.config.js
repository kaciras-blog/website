export default {
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
};
