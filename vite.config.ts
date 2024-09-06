/// <reference types="vitest" />
import { getViteConfig } from "@kaciras-blog/devtool";

// @ts-expect-error
import options from "./config/dev.js";

export default {
	...getViteConfig(options, true, true),
	test: {
		// environment: "happy-dom",
		clearMocks: true,
		include: ["tests/**/*.spec.ts"],
	},
};
