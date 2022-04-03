import { createMemoryHistory, createRouter } from "vue-router";
import { basename, compositor, isOnlyHashChange } from "../src/utils";

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

test.each([
	["foobar.jpg", "foobar"],
	["foo.bar.jpg", "foo.bar"],
	["", ""],
	["foobar", "foobar"],
])("basename of `%s`", (rawName, baseName) => {
	expect(basename(rawName)).toBe(baseName);
});

describe("compositor", () => {
	const template = "AABBCC_DD_EEFF_GG_HHII_JJKK";

	it("should throw if placeholder not found", () => {
		expect(() => compositor(template, { "foo": "bar" })).toThrow();
	});

	it("should if placeholders overlapped", () => {
		const p = {
			foo: /_DD.*_GG/,
			bar: /FF_.*_JJ/,
		};
		expect(() => compositor(template, p)).toThrow();
	});

	it("should composite strings", () => {
		const create = compositor(template, {
			foo: "CC_DD_EE",
			bar: /HHII/,
		});
		const composite = create();
		composite.put("foo", "123");
		composite.put("bar", "456");

		expect(composite.toString()).toBe("AABB123FF_GG_456_JJKK");
	});

	it("should work with zero-width patterns", () => {
		const create = compositor(template, {
			foo: /(?<=EE)(?=FF)/,
			bar: /(?<=EE)(?=FF)/,
		});
		const composite = create();
		composite.put("foo", "123");
		composite.put("bar", "456");
		expect(composite.toString()).toBe("AABBCC_DD_EE123456FF_GG_HHII_JJKK");
	});
});
