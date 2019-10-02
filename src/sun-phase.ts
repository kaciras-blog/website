import { Observable } from "rxjs";

/**
 * 定义太阳阶段，以名称为键，一天之内的起始小时为值。
 * TODO: 目前仅支持小时
 */
export interface SunPhasePoints {
	[key: string]: number;
}

export class SunPhases {

	private readonly array: ReadonlyArray<readonly [string, number]>;

	constructor(breakPoints: SunPhasePoints) {
		const array = this.array = Object.entries(breakPoints);
		if (array.length === 0) {
			throw new Error("Empty sun phases");
		}
		array.sort((a, b) => a[1] - b[1]);
	}

	getCurrent() {
		const hours = new Date().getHours();
		const phase = this.array.find(([, start]) => hours >= start);
		return (phase || this.array[0])[0];
	}

	nextOf(phase: string) {
		const i = this.array.findIndex(([name,]) => name === phase) + 1;
		if (i === 0) {
			throw new Error(`没有任何一个阶段叫${phase}`);
		}
		return (i < this.array.length ? this.array[i] : this.array[0])[0];
	}

	/**
	 * 该函数应当在客户端调用，返回一个可观察对象，根据当前时间来推送各个阶段。
	 * 订阅后将立即触发一次当前的阶段，此后在各阶段相应的时间到达时触发，该订阅一直有效不会结束。
	 *
	 * @param date 当前时间，测试用
	 */
	observe(date = new Date()) {
		const names = Array.from(this.array, x => x[0]);
		const points = Array.from(this.array, x => x[1]);
		points.push(24 + points[0]);

		let [i, initDuration] = getInitialPhase(points, date);

		return new Observable<string>((subscriber) => {
			subscriber.next(names[i]);
			const goToNext = () => {
				i = i < points.length - 2 ? i + 1 : 0;
				subscriber.next(names[i]);
				timer = setTimeout(goToNext, (points[i + 1] - points[i]) * 3600000)
			};
			let timer = setTimeout(goToNext, initDuration);
			subscriber.add(() => clearTimeout(timer));
		});
	}
}

function getInitialPhase(breakPoints: number[], date: Date) {
	const hours = date.getHours();
	const lastIndex = breakPoints.length - 2;
	let index = lastIndex;

	for (let i = 0; i < breakPoints.length; i++) {
		const b = breakPoints[i];
		if (hours < b) {
			const t = date.getTime();
			date.setTime(t + (b - hours) * 3600000);
			date.setMinutes(0, 0, 0);
			return [index, date.getTime() - t];
		}
		index = index < lastIndex ? index + 1 : 0;
	}
	throw new Error("小时最大23，一定小于最后一个元素");
}
