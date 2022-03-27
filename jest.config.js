export default {
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	preset: "ts-jest/presets/default-esm",
	globals: {
		"ts-jest": { useESM: true },
	},
	testMatch: [
		"**/tests/**/*.spec.+(ts|js|tsx|jsx)",
		"**/tests/**/test-*.+(ts|js|tsx|jsx)",
	],
};
