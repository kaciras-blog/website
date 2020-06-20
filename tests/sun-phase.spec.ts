import { SunPhases } from "@/sun-phase";

jest.useFakeTimers();
afterEach(jest.clearAllTimers);

function expectTimeout(time: number) {
	expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time);
	jest.runOnlyPendingTimers();
}

it('should fail on empty points', () => {
	expect(() => new SunPhases({})).toThrow()
});

describe('ofTime', () => {

	const data = new SunPhases({ one: 0, two: 12 });

	it('should return correct phase', () => {
		expect(data.ofTime(new Date('2019-01-01T00:00:00'))).toBe("one");
		expect(data.ofTime(new Date('2019-01-01T12:00:00'))).toBe("two");
	});
});

describe('nextOf', () => {

	const data = new SunPhases({ one: 0, two: 12 });

	it('should return next phase', () => {
		expect(data.nextOf("one")).toBe("two");
		expect(data.nextOf("two")).toBe("one");
	});

	it('should throws on unknown name', () => {
		expect(() => data.nextOf("zero")).toThrow()
	});

	it('should work with single phase', () => {
		const data = new SunPhases({ one: 0 });
		expect(data.nextOf("one")).toBe("one");
	});
});

describe('observe', () => {

	it('should push phases', () => {
		const data = new SunPhases({
			first: 5,
			second: 10,
			third: 20,
		});
		const time = new Date('2019-01-13T02:20:25');
		const results: string[] = [];
		data.observe(time).subscribe(name => results.push(name));

		expectTimeout(9575000);
		expectTimeout(3600000 * 5);
		expectTimeout(3600000 * 10);
		expectTimeout(3600000 * 9);

		jest.clearAllTimers();
		expect(results).toStrictEqual(["third", "first", "second", "third", "first"]);
	});

	it('should work with single phase', () => {
		const results: string[] = [];

		new SunPhases({ first: 19 })
			.observe()
			.subscribe(name => results.push(name));

		jest.runOnlyPendingTimers();
		expectTimeout(86400 * 1000);

		expect(results).toStrictEqual(["first", "first", "first"]);
	});

	it('should work on edge case', () => {
		const data = new SunPhases({
			first: 0,
			second: 23,
		});
		const time = new Date('2019-01-13T00:00:00');
		const results: string[] = [];
		data.observe(time).subscribe(name => results.push(name));

		expectTimeout(3600000 * 23);
		expectTimeout(3600000);
		expect(results).toStrictEqual(["first", "second", "first"]);
	});
});
