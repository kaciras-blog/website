import { Observable } from "rxjs";

/**
 * 定义太阳阶段，以名称为键，一天之内的起始小时为值。
 * TODO: 目前仅支持小时，以后再考虑更精确的日期
 */
export interface SunPhases {
	[key: string]: number;
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

/**
 * 该函数应当在客户端调用，返回一个可观察对象，根据当前时间来推送各个阶段。
 * 订阅后将立即触发一次当前的阶段，此后在各阶段相应的时间到达时触发，该订阅一直有效不会结束。
 *
 * @param phases 太阳阶段的定义
 * @param date 当前时间，测试用
 */
export function observeSunPhases(phases: SunPhases, date = new Date()) {
	const entries = Object.entries(phases);
	if (!entries.length) {
		throw new Error("Empty sun phases");
	}

	entries.sort((a, b) => a[1] - b[1]);
	const names = Array.from(entries, x => x[0]);
	const breakPoints = Array.from(entries, x => x[1]);
	breakPoints.push(24 + breakPoints[0]);

	let [i, initDuration] = getInitialPhase(breakPoints, date);

	return new Observable<string>((subscriber) => {
		subscriber.next(names[i]);
		const goToNext = () => {
			i = i < breakPoints.length - 2 ? i + 1 : 0;
			subscriber.next(names[i]);
			timer = setTimeout(goToNext, (breakPoints[i + 1] - breakPoints[i]) * 3600000)
		};
		let timer = setTimeout(goToNext, initDuration);
		subscriber.add(() => clearTimeout(timer));
	});
}
