// import Velocity from "velocity-animate";
import $ from "jquery";

/**
 * 转义HTML文本中的特殊字符
 *
 * @param text {String} 原始文本
 * @return {String} 转义后的文本
 */
export function escapeHtml(text) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, ch => map[ch]);
}

export function pageReturn() {
	const url = getUrlParamater("return");
	window.location.href = url ? url : "/";
}

export function scrollToElementStart(element) {
	if (typeof element === "string") {
		element = document.getElementById(element);
	}
	$("html,body").animate({ scrollTop: element.offsetTop }, 500);
}

export function scrollToElementEnd(element) {
	if (typeof element === "string") {
		element = document.getElementById(element);
	}
	$("html,body").animate({ scrollTop: element.offsetTop + element.clientHeight }, 500);
	// Velocity(document.getElementsByTagName("html")[0], {scrollTop: element.offsetTop + element.clientHeight}, 200);
}

/**
 * 从Axios的错误原因对象中提取错误信息。
 *
 * @param object {*} 异常
 * @return {string} 错误信息
 */
export function errorMessage(object) {
	const res = object.response;
	if (res && res.data && res.data.message) {
		return res.data.message;
	}
	return object.message || "未知的错误";
}

export function showErrorDialog(vm, title) {
	return function (err) {
		vm.$dialog.messageBox(title, errorMessage(err), "error", false);
	};
}

/**
 * 获取URL中路径的某一片段
 *
 * @param index {int} 位置，负数表示从后往前查找
 * @return {String} 片段的值，找不到则返回null
 */
export function getUrlPathPart(index) {
	const path = window.location.pathname.split("/");
	if (index < 0 && path.length >= -index) {
		return path[path.length + index]; // index: [-path.length - 1, -1]
	} else if (index >= 0 && path.length > index) {
		return path[index]; // index: [0, path.length - 1]
	}
	return null;
}

/**
 * 获取URL中查询参数的值
 *
 * @param name {String} 参数名
 * @return {String} 参数值
 */
export function getUrlParamater(name) {
	return new URLSearchParams(window.location.search).get(name);
}


/**
 * 弹出文件选择框。
 *
 * @param multiple {boolean} 是否多选
 * @param accept {String} 文件类型
 * @return {Promise<File[]>} 一个Promise，将在用户点击确定时完成
 */
export const openFile = (multiple = false, accept = "*") => new Promise(resolve => {
	const input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", accept);
	if (multiple) {
		input.setAttribute("multiple", "");
	}
	input.addEventListener("change", event => resolve(event.target.files));
	input.click();
});


/**
 * 删除并返回数组中符合条件的元素，删除使用splice()函数，能够触发Vue的更新。
 *
 * @param array 数组
 * @param predicate 判断函数
 * @return {Array} 被删除的元素
 */
export function deleteOn(array, predicate) {
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
export function assignUpdate(src, dest) {
	for (let k in dest) {
		if (dest.hasOwnProperty(k) && src.hasOwnProperty(k)) {
			dest[k] = src[k];
		}
	}
	return dest;
}

/**
 * 返回一个Promise，在指定的时间后完成，多用于模拟耗时的操作。
 *
 * @param time 时间，毫秒
 * @return {Promise} 在指定的时间后完成的Promise
 */
export function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

export function limitFrequency(action, duration, returnValue = null) {
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

export class CancelToken {

	constructor() {
		this.canceled = false;
		this.completed = false;
		this.callbacks = [];
	}

	cancel() {
		if(!this.completed) {
			this.canceled = true;
			this.callbacks.forEach(cb => cb());
		}
	}

	onCancel(callback) {
		this.callbacks.push(callback);
	}

	complete() {
		this.completed = true;
	}

	static never() {
		const token = new CancelToken();
		token.cancel = () => {};
		token.onCancel = () => {};
		return token;
	}
}
