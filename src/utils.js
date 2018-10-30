
/**
 * 转义HTML文本中的特殊字符
 *
 * @param text {String} 原始文本
 * @return {String} 转义后的文本
 */
export function escapeHtml (text) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, ch => map[ch]);
}


/**
 * 从Axios的错误原因对象中提取错误信息。
 *
 * @param object {*} 异常
 * @return {string} 错误信息
 */
export function errorMessage (object) {
	const res = object.response;
	if (res && res.data && res.data.message) {
		return res.data.message;
	}
	return object.message || "未知的错误";
}


/**
 * 获取URL中查询参数的值
 *
 * @param name {String} 参数名
 * @return {String} 参数值
 */
export function getUrlParamater (name) {
	return new URLSearchParams(window.location.search).get(name);
}


/**
 * 删除并返回数组中符合条件的元素，删除使用splice()函数，能够触发Vue的更新。
 *
 * @param array 数组
 * @param predicate 判断函数
 * @return {Array} 被删除的元素
 */
export function deleteOn (array, predicate) {
	const removed = [];
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			removed.push(array.splice(i, 1)[0]);
		}
	}
	return removed;
}

/**
 * 使用src对象中的值更新dest对象中相应的字段，该方法与
 * Object.assign不同之处在于不会在目标对象中添加新字段，仅复制
 * 目标对象已存在的字段。
 *
 * @param src 源对象
 * @param dest 目标对象
 * @return {*} 目标对象
 */
export function assignUpdate (src, dest) {
	for (let k in dest) {
		if (dest.hasOwnProperty(k) && src.hasOwnProperty(k)) {
			dest[k] = src[k];
		}
	}
	return dest;
}

export function limitFrequency (action, duration, returnValue = null) {
	let last = 0;
	return function (...args) {
		const current = new Date().getTime();
		if (last + duration > current) {
			last = current;
			return action(...args);
		}
		return returnValue;
	};
}
