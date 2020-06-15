import VueRouter from "vue-router";
import { isOnlyHashChange } from "../src/utils";

describe('isOnlyHashChange', () => {
	const router = new VueRouter();

	it('should ignore hash changes', async () => {
		const from = await router.push("/test");
		const to = await router.push("/test#hash");
		expect(isOnlyHashChange(from, to)).toBe(true);
		expect(isOnlyHashChange(to, from)).toBe(true);
	});

	it('should detect path changes', async () => {
		const from = await router.push("/test");
		const to = await router.push("/article#hash");
		expect(isOnlyHashChange(from, to)).toBe(false);
		expect(isOnlyHashChange(to, from)).toBe(false);
	});

	it('should support query string', async () => {
		const from = await router.push("/test?foo=bar");
		const to = await router.push("/test?foo=bar#hash");
		expect(isOnlyHashChange(from, to)).toBe(true);
		expect(isOnlyHashChange(to, from)).toBe(true);
	});

	it('should detect query changes', async () => {
		const from = await router.push("/test?foo=bar");
		const to = await router.push("/test?foo=___#hash");
		expect(isOnlyHashChange(from, to)).toBe(false);
		expect(isOnlyHashChange(to, from)).toBe(false);
	});
});
