import { RouteLocationNormalized } from "vue-router";
import { uniqueKey } from "@kaciras-blog/uikit";

export const NOOP = () => {};

/**
 * 转义HTML文本中的特殊字符
 *
 * @param text 原始文本
 * @return 转义后的文本
 */
export function escapeHtml(text: string) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#039;",
	};
	// @ts-ignore 正则提取的 ch 一定是 map 的 key
	return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * 从Axios的错误原因对象中提取错误信息。
 *
 * @param object 异常
 * @return 错误信息
 */
export function errorMessage(object: any) {
	const res = object.response;
	if (res?.data?.message) {
		return res.data.message;
	}
	return object.message || "未知的错误";
}

/**
 * 删除并返回数组中符合条件的元素，使用 splice() 函数删除能够触发 Vue2 的更新。
 *
 * @param array 数组
 * @param predicate 判断函数
 * @return 被删除的元素
 */
export function deleteOn<T>(array: T[], predicate: (value: T) => boolean) {
	const removed = [];
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			removed.push(array.splice(i, 1)[0]);
		}
	}
	return removed;
}

/**
 * 给对象附加一个随机的 id 字段（如果没有），作为列表渲染时的 key。
 *
 * 本函数用于一些没有合适的属性作为 key 但又存在重排需求的的对象。
 *
 * @param object 对象
 * @return 原样返回输入的对象
 */
export function attachRandomId(object: any) {
	if (Array.isArray(object)) {
		object.forEach(v => v.id ||= uniqueKey());
	} else {
		object.id ||= uniqueKey();
	}
	return object;
}

// RouteLocation.fullPath 的 Hash 部分是编码后的，所以不能直接减去 RouteLocation.hash。
function removeHash(url: string) {
	const i = url.indexOf("#");
	return i >= 0 ? url.slice(0, i) : url;
}

/**
 * 检查两个路由的 URL 是否仅仅是 Hash 不同而其它部分是一样的。
 * vue-router 竟然没有方便的办法判断。
 *
 * @param to 路由记录
 * @param from 另一个路由记录
 * @return 两个路由除了 Hash 部分外是否一样
 */
export function isOnlyHashChange(to: RouteLocationNormalized, from: RouteLocationNormalized) {
	return removeHash(from.fullPath) === removeHash(to.fullPath);
}

/**
 * 去除文件名中的最后一个扩展名，如果没有则原样返回。
 *
 * @param name 文件名
 * @return 去除了扩展名的部分
 */
export function basename(name: string) {
	const i = name.lastIndexOf(".");
	return i === -1 ? name : name.slice(0, i);
}

type Placeholders = Record<string, string | RegExp>;

/**
 * 闲着无聊写了个简单的字符串替换器，可用于 SSR 中组合最终的 HTML 结果。
 *
 * 原理是通过提前计算替换点位，避免每次都要搜索，从而提高性能。
 * 经测试比 String.replace 快 10 倍，不过也是蚊子肉罢了。
 *
 * @param template 模板字符串
 * @param placeholders 所有替换点位的定义，各个之间不能重叠
 */
export function templateCompositor<T extends Placeholders>(
	template: string,
	placeholders: T,
) {
	const nameToSlot = new Map<keyof T, number>();
	const positions = [];

	for (const name of Object.keys(placeholders)) {
		const pattern = placeholders[name];
		let startPos: number;
		let endPos: number;

		if (typeof pattern === "string") {
			startPos = template.indexOf(pattern);
			if(startPos === -1) {
				throw new Error("找不到匹配串");
			}
			endPos = startPos + pattern.length;
		} else {
			const match = pattern.exec(template);
			if (!match) {
				throw new Error("找不到匹配串");
			}
			startPos = match.index;
			endPos = startPos + match[0].length;
		}

		positions.push({ name, startPos, endPos });
	}

	positions.sort((a, b) => a.startPos - b.startPos);

	let lastEnd = 0;
	const parts: string[] = [];

	for (let i = 0; i < positions.length; i++) {
		const { name, startPos, endPos } = positions[i];
		nameToSlot.set(name, i * 2 + 1);

		parts.push(template.slice(lastEnd, startPos));
		parts.push(template.slice(startPos, lastEnd = endPos));
	}

	parts.push(template.slice(lastEnd));

	return () => new Composite<T>(nameToSlot, [...parts]);
}

export class Composite<T extends Placeholders> {

	private readonly nameToSlot: Map<keyof T, number>;
	private readonly parts: string[];

	constructor(nameToSlot: Map<keyof T, number>, parts: string[]) {
		this.parts = parts;
		this.nameToSlot = nameToSlot;
	}

	toString() {
		return this.parts.join("");
	}

	put(name: keyof T, value: string) {
		this.parts[this.nameToSlot.get(name)!] = value;
	}
}
