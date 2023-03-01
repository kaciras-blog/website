import { RouteLocationNormalized } from "vue-router";
import { uniqueKey } from "@kaciras-blog/uikit";
import { BlogAPIError } from "@/api/core";

/**
 * 从 BlogAPIError 对象中提取错误信息。
 *
 * @param object 异常
 * @return 错误信息
 */
export function errorMessage(object: BlogAPIError) {
	return object.message ?? "未知的错误";
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

/**
 * 标记 HTML，使其被 htmlStringPlugin 处理（展开必要的标签，压缩等）。该函数将在处理后移除。
 */
export function $HTML(..._: unknown[]): string {
	throw new Error("$HTML has not been processed, did you add htmlStringPlugin to build?");
}
