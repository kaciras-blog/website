import { RouteLocationNormalized } from "vue-router";

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
	object.id ||= Math.random();
	return object;
}

/**
 * 检查两个路由的 URL 是否仅仅是 HASH 不同而其它部分是一样的。
 *
 * 【自己实现】
 * Route.path 不带查询参数，Route.query 对象比较又麻烦还不如自己写。
 *
 * @param to 路由记录
 * @param from 另一个路由记录
 * @return 两个路由除了HASH部分外是否一样
 */
export function isOnlyHashChange(to: RouteLocationNormalized, from: RouteLocationNormalized) {
	const fPath = from.fullPath, tPath = to.fullPath;
	const fp = fPath.substring(0, fPath.length - from.hash.length);
	const tp = tPath.substring(0, tPath.length - to.hash.length);
	return fp === tp;
}

/**
 * 获取文件名去除了扩展名的部分，如果没有扩展名则原样返回。
 *
 * 这个函数比较简单就自己实现算了。
 *
 * @param name 文件名
 * @return 去除了扩展名的部分
 */
export function basename(name: string) {
	const i = name.lastIndexOf(".");
	if (i === -1) {
		return name;
	}
	return name.slice(0, i);
}
