import { observeSunPhases } from "@/views/index/sun-phase";

jest.useFakeTimers();

function expectTimeout(time: number) {
	expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time);
	jest.runOnlyPendingTimers();
}

it('should push phases', () => {
	const data = {
		first: 5,
		second: 10,
		third: 20,
	};
	const time = new Date('2019-01-13T02:20:25');
	const results: string[] = [];
	observeSunPhases(data, time).subscribe(name => results.push(name));

	expectTimeout(9575000);
	expectTimeout(3600000 * 5);
	expectTimeout(3600000 * 10);
	expectTimeout(3600000 * 9);

	jest.clearAllTimers();
	expect(results).toStrictEqual(["third", "first", "second", "third", "first"]);
});

it('should fail on empty phases', () => {
	expect(() => observeSunPhases({})).toThrow()
});

it('should work with only one phase', () => {
	const results: string[] = [];
	observeSunPhases({ first: 19 }).subscribe(name => results.push(name));

	jest.runOnlyPendingTimers();
	expectTimeout(86400 * 1000);

	expect(results).toStrictEqual(["first", "first", "first"]);
});

it('should work on edge case', () => {
	const data = {
		first: 0,
		second: 23,
	};
	const time = new Date('2019-01-13T00:00:00');
	const results: string[] = [];
	observeSunPhases(data, time).subscribe(name => results.push(name));

	expectTimeout(3600000 * 23);
	expectTimeout(3600000);
	expect(results).toStrictEqual(["first", "second", "first"]);
});
