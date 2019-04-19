
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
 * 删除并返回数组中符合条件的元素，删除使用splice()函数，能够触发Vue的更新。
 * TODO: lodash 里叫 drop
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

/**
 * 给对象附加一个随机的 randomId 字段，作为列表渲染时的 key。
 * 该方法可以对一个对象重复调用，其 randomId 字段在生成后不会改变。
 *
 * @param object 对象
 * @return 返回输入的对象
 */
export function attachRandomId(object) {
	object.randomId = object.randomId || Math.random();
	return object;
}

// 这段代码压缩之后嵌入在 index.template.html 里，用于检测不支持的浏览器
// (function () {
// 	function checkBrowserSupport() {
// 		if(typeof window.CSS === "undefined") {
// 			return false;
// 		}
// 		return CSS.supports("display", "grid");
// 	}
// 	if(!checkBrowserSupport()) {
// 		var alert = document.createElement("div");
// 		alert.setAttribute("class", "ealert");
// 		alert.innerText = "您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站。" +
// 			"请使用最新版的Edge、Firefox、Chrome、Safari等浏览器（本站不支持IE）";
// 		document.body.insertBefore(alert, document.body.firstChild);
// 	}
// })();
