import { Observable } from "rxjs";

/**
 * 定义太阳位置，以名称为键，一天之内的起始小时为值。
 * 太阳位置是循环的，一天的最后一个结束后将从下一天的第一个开始。
 * TODO: 目前仅支持小时
 */
export interface SunPhasePoints {
	[key: string]: number;
}

/**
 * 提供对太阳位置查询的类，太阳位置所对应的时间由用户定义，该类对其进行封装，
 * 提供查询和自动监听变化等功能。
 *
 * 该类目前用于首页大图，使其在不同的时间段切换不同的背景。
 */
export class SunPhases {

	private readonly names: string[];
	private readonly points: number[];

	constructor(breakPoints: SunPhasePoints) {
		const array = Object.entries(breakPoints);
		if (array.length === 0) {
			throw new Error("Empty sun phases");
		}
		array.sort((a, b) => a[1] - b[1]);
		array.push([array[0][0], 24 + array[0][1]]);

		this.names = Array.from(array, x => x[0]);
		this.points = Array.from(array, x => x[1]);
	}

	/**
	 * 查询给定时间太阳所处的位置
	 *
	 * @param date 时间
	 * @return 太阳所处的位置
	 */
	ofTime(date: Date) {
		const { points } = this;
		const hours = date.getHours();

		for (let i = points.length; i >= 0; i--) {
			if (points[i] < hours) {
				return this.names[i + 1];
			}
		}
		return this.names[0];
	}

	/**
	 * 获取给定太阳位置的下一个位置
	 *
	 * @param phase 前一个位置
	 * @return 下一个位置
	 * @throws 如果给定的位置不在此类中
	 */
	nextOf(phase: string) {
		const i = this.names.indexOf(phase);
		if (i < 0) {
			throw new Error(`没有任何一个阶段叫${phase}`);
		}
		return this.names[i + 1];
	}

	/**
	 * 该函数应当在客户端调用，返回一个可观察对象，根据当前时间来推送各个阶段。
	 * 订阅后将立即触发一次当前的阶段，此后在各阶段相应的时间到达时触发，该订阅一直有效不会结束。
	 *
	 * @param date 当前时间，测试用
	 * @return RxJS 的 Observable
	 */
	observe(date = new Date()) {
		const { names, points } = this;
		let [i, initDuration] = getInitial(points, date);

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

function getInitial(breakPoints: number[], date: Date) {
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
