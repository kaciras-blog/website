import VueRouter from "vue-router";
import { basename, isOnlyHashChange } from "../src/utils";

describe('isOnlyHashChange', () => {
	const router = new VueRouter();

	async function test(from: string, to: string, result: boolean) {
		const fromRoute = await router.push(from);
		const toRoute = await router.push(to);
		expect(isOnlyHashChange(fromRoute, toRoute)).toBe(result);
		expect(isOnlyHashChange(toRoute, fromRoute)).toBe(result);
	}

	it('should ignore hash changes', () => test("/test", "/test#hash", true));
	it('should detect path changes', () => test("/test", "/article#hash", false));

	it('should support query string', () => test("/test?foo=bar", "/test?foo=bar#hash", true));
	it('should detect query changes', () => test("/test?foo=bar", "/test?foo=___#hash", false));
});

test.each([
	["foobar.jpg", "foobar"],
	["foo.bar.jpg", "foo.bar"],
	["", ""],
	["foobar", "foobar"],
])('basename of `%s`', (rawName, baseName) => {
	expect(basename(rawName)).toBe(baseName);
});
