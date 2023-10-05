import { createMemoryHistory, createRouter } from "vue-router";
import { basename, isOnlyHashChange } from "../src/utils.ts";
import { describe, expect, it } from "vitest";

describe("isOnlyHashChange", () => {
	const router = createRouter({ routes: [], history: createMemoryHistory() });

	async function run(from: string, to: string, result: boolean) {
		await router.push(from);
		const fromRoute = router.currentRoute.value;
		await router.push(to);
		const toRoute = router.currentRoute.value;

		expect(isOnlyHashChange(fromRoute, toRoute)).toBe(result);
		expect(isOnlyHashChange(toRoute, fromRoute)).toBe(result);
	}

	it("should ignore hash changes", () => run("/test", "/test#hash", true));
	it("should detect path changes", () => run("/test", "/article#hash", false));

	it("should support query string", () => run("/test?foo=bar", "/test?foo=bar#hash", true));
	it("should detect query changes", () => run("/test?foo=bar", "/test?foo=___#hash", false));
});

it.each([
	["foobar.jpg", "foobar"],
	["foo.bar.jpg", "foo.bar"],
	["", ""],
	["foobar", "foobar"],
])("basename of `%s`", (rawName, baseName) => {
	expect(basename(rawName)).toBe(baseName);
});
