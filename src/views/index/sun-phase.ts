import { Observable } from "rxjs";

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
